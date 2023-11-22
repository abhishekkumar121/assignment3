import React, { useState } from "react";
import userData from "./userData";
import "./App.css";

const UserCard = ({ user, onAddToTeam }) => {
  return (
    <div
      className="card_div"
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px",
        borderRadius: "8px",
        width: "270px",
        backgroundColor: "rgb(229, 226, 226)",
      }}
    >
      <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
      <h3>{`${user.first_name} ${user.last_name}`}</h3>
      <p>Email: {user.email}</p>
      <p>Gender: {user.gender}</p>
      <p>Domain: {user.domain}</p>
      <p>Availability: {user.available ? "Available" : "Not Available"}</p>
      <button className="button_card" onClick={() => onAddToTeam(user)}>
        Add to Team
      </button>
    </div>
  );
};

const UserList = ({ users, onAddToTeam }) => {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} onAddToTeam={onAddToTeam} />
      ))}
    </div>
  );
};

const TeamList = ({ team }) => {
  return (
    <div>
      <h2 className="head">Team Details</h2>
      {team.map((user, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          {`${user.first_name} ${user.last_name} (${user.domain})`}
        </div>
      ))}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            margin: "5px",
            padding: "5px",
            cursor: "pointer",
            backgroundColor: currentPage === page ? "#ddd" : "#fff",
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const App = () => {
  const usersPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState(true);
  const [team, setTeam] = useState([]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  let filteredUsers = userData
    .filter((user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => (domainFilter ? user.domain === domainFilter : true))
    .filter((user) => (genderFilter ? user.gender === genderFilter : true))
    // .filter((user) => (availabilityFilter ? user.available : true));
    .filter((user) => {
      if (availabilityFilter === "true") {
        return user.available;
      } else if (availabilityFilter === "false") {
        return !user.available;
      } else {
        return true;
      }
    });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset page when searching
  };

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    switch (filterType) {
      case "domain":
        setDomainFilter(value);
        break;
      case "gender":
        setGenderFilter(value);
        break;
      case "availability":
        setAvailabilityFilter(value);
        break;
      default:
        break;
    }
  };

  const handleAddToTeam = (user) => {
    if (
      !team.some((member) => member.domain === user.domain) &&
      user.available
    ) {
      setTeam([...team, user]);
    }
  };

  return (
    <div
      className="main_div" /*style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}*/
    >
      <div className="search_part">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <hr />
      <div className="filters">
        <div className="domain_filter">
          <label>Filter by Domain:</label>
          <select
            onChange={(e) => handleFilterChange("domain", e.target.value)}
          >
            <option value="">All</option>

            {Array.from(new Set(userData.map((user) => user.domain))).map(
              (domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              )
            )}
          </select>
        </div>
        <div className="gender_filter">
          <label>Filter by Gender:</label>
          <select
            onChange={(e) => handleFilterChange("gender", e.target.value)}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Agender">Agender</option>
          </select>
        </div>
        <div className="avail_filter">
          <label>Filter by Availability:</label>
          <select
            onChange={(e) => handleFilterChange("availability", e.target.value)}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
      </div>
      <hr />
      <div className="team_div">
        <TeamList team={team} />
      </div>
      <hr />
      <div className="list_div">
        <UserList users={currentUsers} onAddToTeam={handleAddToTeam} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default App;
