// email 가입
async function insertUserEmailInfo(connection, insertUserInfoParams){
  const insertUserInfoEmailQuery = `
    INSERT INTO Users(firstName, secondName, birth, email, password)
    VALUES (?, ?, ?, ?, ?);  
  `;

  const insertUserInfoRow = await connection.query(
      insertUserInfoEmailQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
};

// phone 가입
async function insertUserPhoneInfo(connection, insertUserInfoParams){
  const insertUserInfoPhoneQuery = `
    INSERT INTO Users(firstName, secondName, birth, phone, password)
    VALUES (?, ?, ?, ?, ?);  
  `;

  const insertUserInfoRow = await connection.query(
      insertUserInfoPhoneQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
};

// email check
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
    select email, password from Users where email=?;
  `;
  const insertUserEmailRow = await connection.query(
      selectUserEmailQuery,
      email
  );
  return insertUserEmailRow[0];
};

// phone check
async function selectUserPhone(connection, phone) {
  const selectUserPhoneQuery = `
    select phone, password from Users where phone=?;
  `;
  const insertUserPhoneRow = await connection.query(
      selectUserPhoneQuery,
      phone
  );
  return insertUserPhoneRow[0];
};

// email password check
async function selectUserEmailPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
    select email, password from Users where email=? and password=?;
  `;

  const insertUserPasswordRow = await connection.query(
    selectUserPasswordQuery,
    selectUserPasswordParams
  );
  return insertUserPasswordRow[0];
};

// phone password check
async function selectUserPhonePassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
    select phone, password from Users where phone=? and password=?;
  `;

  const insertUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );
  return insertUserPasswordRow[0];
};

// phone account check
async function selectPhoneAccount(connection, phone) {
  const selectPhoneAccountQuery = `
    select idx, status from Users where phone=?;
  `;

  const selectPhoneAccountRow = await connection.query(
    selectPhoneAccountQuery,
    phone
  );

  return selectPhoneAccountRow[0];
};

// email account check
async function selectEmailAccount(connection, email) {
  const selectEmailAccountQuery = `
    select idx, status from Users where email=?;
  `;

  const selectEmailAccountRow = await connection.query(
    selectEmailAccountQuery,
    email
  );

  return selectEmailAccountRow[0];
};

async function selectUserId(connection) {
  const selectUserListQuery = `
    select 
           idx,
           profileImg,
           secondName,
           firstName,
           gender,
           email,
           phone,
           birth,
           isContact,
           isIdCard,
           status
    from Users;
  `;
  const [usersRows] = await connection.query(selectUserListQuery);
  return usersRows;
};

async function selectStatus(connection, status, userIdx) {
  const selectStatusQuery = `
    select status from Users where idx=?;
  `;
  const [statusRows] = await connection.query(selectStatusQuery, status, userIdx);
  return statusRows;
}

// 유저 수정
async function updateUserInfo(connection, profileImg, firstName, secondName, gender, birth, email, phone, userIdx){
  const updateUserInfoQuery = `
    update Users
    set profileImg = if(isnull(profileImg), ?, null),
        firstName = ?,
        secondName = ?,
        gender = ?,
        birth = ?,
        email = ?,
        phone = ?
    where idx = ?;
  `;

  const updateUserInfoRow = await connection.query(updateUserInfoQuery, [profileImg, firstName, secondName, gender, birth, email, phone, userIdx]);
  return updateUserInfoRow;
};

// 유저 상태 수정
async function updateStatus(connection, status, userIdx) {
  const updateStatusQuery = `
    update Users
    set status = ?
    where idx = ?;
  `;

  const updateStatusRow = await connection.query(updateStatusQuery, [status, userIdx]);
  return updateStatusRow
};

module.exports = {
  insertUserEmailInfo,
  insertUserPhoneInfo,
  selectUserEmail,
  selectUserPhone,
  selectUserEmailPassword,
  selectUserPhonePassword,
  selectPhoneAccount,
  selectEmailAccount,
  selectUserId,
  selectStatus,
  updateUserInfo,
  updateStatus,
};