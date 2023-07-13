const express = require("express");

const router = express.Router();
const database = require("../connection/connectMySQL");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { formatDate1 } = require("../formatData/formatDate");

router.use(bodyParser.json()); // Luu y
router.use(bodyParser.urlencoded({ extended: true })); // Cho phép sử dụng các phương thức có sẵn của JS

// API lấy thông tin tất cả user
router.get("/", (req, res) => {
  console.log(req.query);

  const name = req.query.UserName;
  const page = parseInt(req.query.OFFSET) || 1;
  const pageSize = parseInt(req.query.LIMIT) || 10;

  // Khai báo chuỗi query string - Câu lệnh thao tác với SQL
  let queryString = "SELECT * FROM users";

  // Đếm số lượng bản ghi trong db
  let countQueryString = "SELECT COUNT(*) as total FROM users";

  if (name) {
    queryString += ` WHERE UserName LIKE '%${name}%'`;
    countQueryString += ` WHERE UserName LIKE '%${name}%'`;
  }

  const offset = (page - 1) * pageSize;
  queryString += ` LIMIT ${pageSize} OFFSET ${offset}`;

  // Gọi database
  database.query(queryString, (error, results) => {
    console.log("results", results);
    if (error) {
      return res.status(500).json({
        status: 500,
        message: "Đã có lỗi xảy. Vui lòng liên hệ để được giải đáp",
        error: error,
      });
    } else {
      // Lấy tổng số lượng bản ghi
      database.query(countQueryString, (countError, countResults) => {
        if (countError) {
          return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy. Vui lòng liên hệ để được giải đáp",
            error: countError,
          });
        } else {
          const totalCount = countResults[0].total;
          const totalPages = Math.ceil(totalCount / pageSize);

          return res.status(200).json({
            status: 200,
            results: results.length,
            totalPages: totalPages,
            data: results,
          });
        }
      });
    }
  });
});

// API lấy thông tin một user theo ID
router.get("/:id", (req, res) => {
  // Lấy id từ phía client
  const { id } = req.params;
  // Khai báo chuỗi query string -  Câu lệnh thao tác với SQL
  const queryString =
    "select UserName, Gender, DateOfBirth, Email, ModifiedDate, ModifiedBy from users where UserId = ?";

  // Gọi database
  database.query(queryString, id, (error, results) => {
    // Nếu thất bại
    if (error) {
      return res.status(500).json({
        status: 500,
        message: "Đã có lỗi xảy. Vui lòng liên hệ để được giải đáp",
        error: error,
      });
    } else {
      // Nếu thành công
      return res.status(200).json({
        status: 200, // Trạng thái lấy dữ liệu thành công
        data: results, // Toàn bộ dữ liệu
      });
    }
  });
});

// API Xóa thông tin một user theo id
router.delete("/:id", (req, res) => {
  // Lấy id từ phía client
  const { id } = req.params;
  // Câu lệnh query xóa thông tin bản ghi
  const query = `delete from users where UserId = "${id}"`;
  // Gọi database
  database.query(query, (error, result) => {
    // Nếu thất bại
    if (error) {
      return res.status(500).json({
        status: 500,
        message: "Đã có lỗi xảy ra",
        error: error,
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "Xóa thông tin người dùng thành công!",
      });
    }
  });
});

// API cập nhật thông tin một user theo id
router.put("/:id", (req, res) => {
  // Lấy id từ phía client
  const { id } = req.params;
  // Lấy các thông tin cần cập nhật
  const { UserName, Gender, DateOfBirth, Email, ModifiedDate, ModifiedBy } =
    req.body;

  const newDate = formatDate1(DateOfBirth);
  const newModifiedDate = formatDate1(new Date());

  // Dữ liệu user mới cần cập nhật
  const newUser = [
    UserName,
    Gender,
    newDate,
    Email,
    newModifiedDate,
    ModifiedBy,
    id,
  ];

  // Viết câu lệnh query
  const queryString = `update users set UserName = ?, Gender = ?, DateOfBirth = ? ,Email=? ,ModifiedDate=?, ModifiedBy = ? where UserId = ?`;

  // Gọi đến database
  database.query(queryString, newUser, (error, result) => {
    // Kiểm tra kết quả trả về
    // Thất bại
    if (error) {
      return res.status(500).json({
        status: 500,
        message: "Đã có lỗi xảy ra",
        error: error,
      });
    } else {
      // Thành công
      return res.status(200).json({
        status: 200,
        message: "Cập nhật thông tin người dùng thành công!",
      });
    }
  });
});

// API đăng kí tài khoản
router.post("/register", (req, res) => {
  // Lấy dữ liệu từ body
  const {
    UserName,
    Gender,
    DateOfBirth,
    CreatedDate,
    CreatedBy,
    ModifiedDate,
    ModifiedBy,
    Email,
    Password,
  } = req.body;

  bcrypt.hash(Password, 10, (error, hashResult) => {
    // NẾu thất bại
    if (error) {
      return res.status(500).json({
        status: 500,
        message: "Đã có lỗi xảy ra",
        error: error,
      });
    } else {
      // Nếu hash thành công
      // Đối tươngj newUser
      const newUser = [
        UserName,
        Gender,
        DateOfBirth,
        CreatedDate,
        CreatedBy,
        ModifiedDate,
        ModifiedBy,
        Email,
        hashResult,
      ];
      // Viết câu lệnh query
      const queryString =
        "insert into users(UserName, Gender, DateOfBirth, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, Email, Password) values (?, ?, ?, ?, ?, ?, ?, ? , ?)";
      // Nhận kết qủa trả về
      database.query(queryString, newUser, (err, result) => {
        // Nếu thất bại
        if (err) {
          return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra",
            error: err,
          });
        } else {
          return res.status(201).json({
            status: 201,
            message: "Thêm mới dữ liệu thành công",
          });
        }
      });
    }
  });
});

// API đăng nhập
router.post("/login", (req, res) => {
  // Lấy dữ liệu từ phía client
  const { Email, Password } = req.body;
  // Viết câu lệnh query
  const queryString = "select * from users where Email = ?";
  // Kết nối
  database.query(queryString, Email, (err, result) => {
    // Kiểm tra kết quả
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Đã có lỗi xảy ra",
        error: err,
      });
    } else {
      // Kiểm tra email có tồn tại trong DB không?
      if (result.length === 0) {
        return res.status(400).json({
          status: 400,
          message: "Email không tồn tại trong hệ thống",
        });
      } else {
        const user = result[0];
        // Nếu có tồn tại
        // Tiến hành chuyển đổi password từ dạng JWT sang dạng bình thường
        bcrypt.compare(Password, user.Password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: "Đã có lỗi xảy ra",
              error: err,
            });
          } else {
            // Nếu hai mật khẩu khớp nhau
            if (isMatch) {
              return res.status(200).json({
                status: 200,
                message: "Đăng nhập thành công",
                data: user,
              });
            } else {
              return res.status(400).json({
                status: 400,
                message: "Mật khẩu không đúng",
              });
            }
          }
        });
      }
    }
  });
});

// API thay đổi mật khẩu
router.post("/change-password/:id", (req, res) => {
  // Lấy id từ param
  const { id } = req.params;
  // Lấy dữ liệu từ body
  const { oldPassword, newPassword } = req.body;

  console.log(req.body);
  // Kiểm tra id có tồn tại trong database?
  const queryString = `SELECT * FROM users where UserId = ${id}`;
  // Kiểm tra kết nối câu lệnh truy vấn đến db
  database.query(queryString, (err, result) => {
    // Kết quả trả về
    if (err) {
      return res.status(500).json({
        status: 500,
        userMsg: "Lỗi hệ thống", // lôix trả về cho phía client
        devMsg: err, // Lỗi trả về cho dev
      });
    } else if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        userMsg: "Không tìm thấy user", // lỗi trả về cho phía client
      });
    } else {
      // Nếu có kết quả
      const user = result[0];
      // So sánh mật khẩu cũ và mật khẩu mới
      // compare mật khẩu cũ để kiểm tra với mật khẩu trong db
      bcrypt.compare(oldPassword, user.Password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            userMsg: "Lỗi hệ thống", // lôix trả về cho phía client
            devMsg: err, // Lỗi trả về cho dev
          });
        } else if (!isMatch) {
          return res.status(401).json({
            status: 401,
            userMsg: "Mật khẩu nhập vào không khớp", // lôix trả về cho phía client
          });
        } else {
          // Chuyển mật khẩu mới về dạng jsonwebtoken
          bcrypt.hash(newPassword, 10, (err, hasdedPassword) => {
            if (err) {
              return res.status(500).json({
                status: 500,
                devMsg: err, // Lỗi trả về cho dev
              });
            } else {
              // Cập nhật mật khẩu trong cơ sở dữ liệu
              const queryUpdatePassword = `UPDATE users SET Password = "${hasdedPassword}" Where UserId = ${id}`;
              database.query(queryUpdatePassword, (err, result) => {
                if (err) {
                  return res.status(500).json({
                    status: 500,
                    devMsg: err, // Lỗi trả về cho dev
                  });
                } else {
                  return res.status(200).json({
                    status: 200,
                    mesage: "Cập nhật mật khẩu thành công",
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
