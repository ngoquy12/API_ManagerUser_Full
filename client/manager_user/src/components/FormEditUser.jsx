import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate1 } from "../formatData/formatDate";
import { notification } from "antd";

export default function FormEditUser() {
  const genders = [
    {
      id: 0,
      title: "Male",
    },
    {
      id: 1,
      title: "Female",
    },
    {
      id: 2,
      title: "Other",
    },
  ];

  const { id } = useParams();
  const [gender, setGender] = useState(0);
  console.log("gender=======>", gender);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    UserName: "",
    Gender: 0,
    DateOfBirth: "",
    Email: "",
    ModifiedBy: "Ngọ Văn Quý",
  });

  const { UserName, Gender, DateOfBirth, Email, ModifiedBy } = user;

  console.log("user", user);

  const getById = () => {
    axios
      .get(`http://localhost:3000/api/v1/users/${id}`)
      .then((res) => {
        setUser(res.data.data[0]);
        setGender(res.data.data[0].Gender);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    getById();
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/api/v1/users/${id}`, user)
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/");
          notification.success({
            message: "Cập nhật thông tin thành công",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Edit user
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleEdit}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Username
                </label>
                <input
                  value={user.UserName}
                  onChange={handleChange}
                  type="text"
                  name="UserName"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  DateOfBirth
                </label>
                <input
                  name="DateOfBirth"
                  value={formatDate1(user.DateOfBirth)}
                  onChange={handleChange}
                  type="date"
                  className="form-control"
                  id="date"
                  aria-describedby="emailHelp"
                />
              </div>
              <div>
                <label className="p-1" htmlFor="">
                  Gender
                </label>
                <div className="d-flex gap-2">
                  {genders.map((item) => (
                    <div className="form-check" key={item.id}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="Gender"
                        value={user.Gender}
                        onChange={() => setGender(item.id)}
                        checked={item.id === gender}
                      />
                      <label className="form-check-label" htmlFor="other">
                        {item.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  onChange={handleChange}
                  name="Email"
                  value={user.Email}
                  type="email"
                  className="form-control"
                  id="email"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
