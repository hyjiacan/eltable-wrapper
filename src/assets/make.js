const fs = require('fs')

let data = []

for (let i = 0; i < 99; i++) {
  data.push({
    id: i,
    name: 'name' + i,
    dept: 'dept' + i,
    remark: 'remark' + i
  })
}

fs.writeFileSync('mock.js', JSON.stringify(data, null, 2))
