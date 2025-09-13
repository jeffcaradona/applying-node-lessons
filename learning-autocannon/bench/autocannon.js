// filepath: e:\Users\jeffc\Source\Repos\GitHub\applying-node-lessons\learning-autocannon\bench\autocannon.js
import autocannon from 'autocannon';

const url = 'http://localhost:3000/api'; // Adjust port/path as needed

autocannon({
  url,
  connections: 100, // concurrent connections
  duration: 10,     // test duration in seconds
}, (err, result) => {
  if (err) throw err;
  console.log(autocannon.printResult(result));
});