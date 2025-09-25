const axios = require('axios');
const { initDB, insertUsers } = require('./models/userModel');
require('dotenv').config();

async function seed(count = 1000) {
  await initDB();
  const perRequest = 50;
  let fetched = 0;
  let page = 1;
  while (fetched < count) {
    const need = Math.min(perRequest, count - fetched);
    const url = `https://randomuser.me/api/?results=${need}&page=${page}`;
    const r = await axios.get(url);
    const items = (r.data.results || []).map(it => ({
      uuid: it.login.uuid,
      name: `${it.name.first} ${it.name.last}`,
      email: it.email,
      city: it.location.city
    }));
    await insertUsers(items);
    fetched += items.length;
    page++;
    if (items.length === 0) break;
    console.log(`Inserted batch, total so far: ${fetched}`);
  }
  console.log(`Finished seeding. Requested ${count} — processed ${fetched}`);
  process.exit(0);
}

seed(process.argv[2] ? parseInt(process.argv[2], 10) : 1000).catch(err => {
  console.error(err);
  process.exit(1);
});
