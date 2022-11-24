import pg from 'pg';
const { Pool } = pg

const pool= new Pool({
  user:"postgres",
  host:"localhost",
  database:"users",
  password:"srinivas@1621",
  port:5432,
})

export default pool;
    