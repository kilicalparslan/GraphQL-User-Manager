import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    addUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});

  const {
    data: getUsersData,
    loading: getUsersLoading,
    error: getUsersError,
  } = useQuery(GET_USERS);

  const {
    data: getUsersByIdData,
    loading: getUsersByIdLoading,
    error: getUsersByIdError,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: "1" },
  });

  const [addUser] = useMutation(ADD_USER);
  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache, { data: { deleteUser } }) {
      const { getUsers } = cache.readQuery({ query: GET_USERS });

      cache.writeQuery({
        query: GET_USERS,
        data: {
          getUsers: getUsers.filter((user) => user.id !== deleteUser.id),
        },
      });
    },
  });

  const handleAddUser = async () => {
    addUser({
      variables: {
        name: newUser.name,
        age: parseInt(newUser.age),
        isMarried: false,
      },
    });
  };

  if (getUsersLoading) return <p>Loading...</p>;
  if (getUsersError) return <p>Error: {error.message}</p>;

  return (
    <>
      <div>
        <input
          placeholder="Name..."
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="Age..."
          type="number"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      <h1>Users</h1>
      <div>
        {getUsersByIdLoading ? (
          <p>Loading user...</p>
        ) : (
          <>
            <h1 style={{ display: "flex" }}>Chosen User: </h1>
            <p>{getUsersByIdData.getUserById.name}</p>
            <p>{getUsersByIdData.getUserById.age}</p>
          </>
        )}
      </div>
      <div>
        {getUsersData.getUsers.map((user) => (
          <div key={user.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h2 style={{ marginRight: "10px" }}>{user.name}</h2>
              <button
                style={{
                  padding: "2px",
                }}
                onClick={() => deleteUser({ variables: { id: user.id } })}
              >
                Delete
              </button>
            </div>
            <p>Age: {user.age}</p>
            <p>Married: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
