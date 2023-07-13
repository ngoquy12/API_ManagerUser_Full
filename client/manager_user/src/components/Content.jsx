import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../formatData/formatDate";
import { notification } from "antd";
import { Link } from "react-router-dom";

export default function Content() {
  // Khai báo các biến
  const [users, setUsers] = useState([]);

  // Hàm loadData
  const loadData = () => {
    axios
      .get("http://localhost:3000/api/v1/users")
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Xóa thông tin một user theo id
  const handleDelete = (id) => {
    // Gọi API xóa
    axios
      .delete(`http://localhost:3000/api/v1/users/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          loadData();
          notification.success({
            message: "Xóa thông tin thành công!",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <>
        <div className="p-3 d-flex justify-content-between">
          <h3>Manager User</h3>
          <div className="d-flex gap-3">
            <input
              type="text"
              placeholder="Search username..."
              className="form-control w-100"
            />
            <select className="form-control">
              <option value="">Hiển thị 10 bản ghi</option>
              <option value="">Hiển thị 20 bản ghi</option>
              <option value="">Hiển thị 50 bản ghi</option>
              <option value="">Hiển thị 100 bản ghi</option>
            </select>
            {/* Modql adduser */}
            {/* Button trigger modal */}
            <Link to="/form-add">
              <button type="button" className="btn btn-primary">
                Add
              </button>
            </Link>
            {/* Modal */}
          </div>
        </div>
        {/* table */}
        <table className="table table-hover table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Username</th>
              <th scope="col">Gender</th>
              <th scope="col">DateOfBirth</th>
              <th scope="col">Email</th>
              <th className="text-center" colSpan={2} scope="col">
                Option
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <>
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.UserName}</td>
                  <td>
                    {user.Gender === 0
                      ? "Nam"
                      : user.Gender === 1
                      ? "Nữ"
                      : "Khác"}
                  </td>
                  <td>{formatDate(user.DateOfBirth)}</td>
                  <td>{user.Email}</td>
                  <td className="text-center">
                    {/* Button trigger modal */}
                    <Link to={`/form-edit/${user.UserId}`}>
                      <button type="button" className="btn btn-warning">
                        Edit
                      </button>
                    </Link>
                    {/* Modal */}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(user.UserId)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
        {/* Paging */}
        <div className="d-flex justify-content-end">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  Previous
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </>
    </div>
  );
}
