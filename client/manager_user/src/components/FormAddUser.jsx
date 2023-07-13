import React, { useState } from "react";
import { formatDate1 } from "../formatData/formatDate";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FormAddUser() {
  // Khai bao du lieu
  const [userName, setUserName] = useState("");
  const [DateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  // Tạo đối tượng newUser
  const newUser = {
    UserName: userName,
    Gender: gender,
    DateOfBirth: formatDate1(DateOfBirth),
    CreatedDate: formatDate1(new Date()),
    CreatedBy: "Ngọ Văn Quý",
    ModifiedDate: formatDate1(new Date()),
    ModifiedBy: "Ngọ Văn Quý",
    Email: email,
    Password: password,
  };

  // Hàm handleSubmit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API đăng kí tài khoản
    axios
      .post("http://localhost:3000/api/v1/users/register", newUser)
      .then((res) => {
        if (res.data.status === 201) {
          // Chuyển về tảng chủ
          navigate("/");
          // Load lại dữ liệu
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
              Add user
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="form-control"
                  id="name"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  DateOfBirth
                </label>
                <input
                  type="date"
                  value={DateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
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
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="male"
                        onChange={() => setGender(item.id)}
                        checked={item.id === gender}
                      />
                      <label className="form-check-label" htmlFor="male">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="form-control"
                  id="email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  id="password"
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
