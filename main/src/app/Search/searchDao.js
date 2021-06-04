async function selectUserByHost(connection, state) {
  const selectUserByHostQuery = `
      select
          Host.idx as idx,
          Host.userIdx as userIdx,
          Host.hostName as hostName,
          A_PH.hostImg as hostImg,
          accType,
          accTypeDetail,
          typeHouse,
          isGuest,
          country,
          state,
          city,
          street,
          zip,
          basePrice,
          DATE_FORMAT(Host.createAt, '%Y-%m-%d') as registerDate,
          if(isnull((select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)), 0, (select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)) as rating,
          (select count(hostIdx) from Review where Review.hostIdx = Host.idx) as reviewCnt
      from Host
               left join AccommodationPhoto A_PH on A_PH.hostIdx = Host.idx
               left join Review R on R.hostIdx = Host.idx
      where Host.status = 'ACTIVE' and state = ?
      group by Host.idx;
  `;

  const selectUserByHostRow = await connection.query(
      selectUserByHostQuery,
      [state]
  );

  return selectUserByHostRow[0];
}

async function selectUserByHostName(connection, hostIdx) {
  const selectUserByHostNameQuery = `
    select
        Host.idx as idx,
        Host.userIdx as userIdx,
        Host.hostName as hostName,
        A_PH.hostImg as hostImg,
        accType,
        accTypeDetail,
        typeHouse,
        isGuest,
        country,
        state,
        city,
        street,
        zip,
        basePrice,
          DATE_FORMAT(Host.createAt, '%Y-%m-%d') as registerDate,
          if(isnull((select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)), 0, (select round(avg(rating), 2) from Review where Review.hostIdx = Host.idx)) as rating,
          (select count(hostIdx) from Review where Review.hostIdx = Host.idx) as reviewCnt
      from Host
               left join AccommodationPhoto A_PH on A_PH.hostIdx = Host.idx
               left join Review R on R.hostIdx = Host.idx
      where Host.status = 'ACTIVE' and Host.idx = ?
      group by Host.idx;
  `;

  const selectUserByHostNameRow = await connection.query(
      selectUserByHostNameQuery,
      [hostIdx]
  );

  return selectUserByHostNameRow[0];
}

module.exports = {
  selectUserByHost,
  selectUserByHostName,
}