var fs = require('fs');
var stream = fs.createReadStream('./resource.json');

// 数据是一块一块的传送，每收到一块数据就开始处理，不用等所有数据都到全了再做处理
// 当有新的数据块准备好时会激发data事件
stream.on('data', function (chunk) {
    console.log(chunk);
});

// 当所有数据块都加载完之后，激发end事件
stream.on('end', function () {
    console.log('finished');
});