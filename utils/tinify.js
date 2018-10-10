const tinify = require('tinify');
tinify.key = 'YPlyi0e4dvSlhPcKf3YDXaszS5DWmqam';

var source = tinify.fromUrl("https://tinypng.com/images/panda-happy.png");
source.toFile("optimized.jpg");