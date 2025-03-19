import React from 'react'
import { useState, useEffect } from 'react'
import './style.css'
import axios from 'axios'

let url = "http://localhost:3000";

const Form = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        age: '',
        email: ''
    });
    const getUsers = async () => {
       try {
        let response = await axios.get(`${url}/users`);
        console.log(response.data);
        setUsers(response.data);
       } catch (error) {
        console.error("Error fetching user error", error)
       }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleOnComplete = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                // Update user
                await axios.put(`${url}/users/${formData.id}`, formData);
                alert("User  updated successfully");
            } else {
                // Add new user
                await axios.post(`${url}/users`, formData);
                alert("User  added successfully");
            }
            setFormData({ id: '', name: '', age: '', email: '' });
            getUsers();
        } catch (error) {
            console.error("Error adding/updating user", error);
            alert("Error adding/updating user");
        }
    }

    const handleEdit = (user) => {
        setFormData(user);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url}/users/${id}`);
            alert("User  deleted successfully");
            getUsers();
        } catch (error) {
            console.error("Error deleting user", error);
            alert("Error deleting user");
        }
    };

    useEffect(() => {
        getUsers();
    },[])

    return (
        <>
         <form onSubmit={handleOnComplete}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                    />
                </div>
                <div>
                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                </div>
                <button type="submit">Add User</button>
            </form>

            <h2>User List:</h2>
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.id}>
                        <strong> ID: {user.id}, Name: {user.name}, Age: {user.age}, Email: {user.email}</strong>
                        <div>
                            <button onClick={() => handleEdit(user)}>Update</button>
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

     

export default Form