/**棋盘 */
var box = document.querySelector('#box');
/**悔棋按钮*/
var btnhui = document.querySelector('.btnhui');
/**撤销按钮*/
var btnche = document.querySelector('.btnche');
/** 重置按钮*/
var btncz = document.querySelector('.btncz');
/**棋盘规格*/
var sizeNumber = 21;
/**每隔大小*/
var size = 27;
/** 棋子半径*/
var qizir = 10;
/** 棋盘x轴位置 */
var boxleft = box.offsetLeft;
/**棋盘y轴位置 */
var boxtop = box.offsetTop;
/**棋子颜色 */
var qiziColor = 'red';
/**棋子信息*/
var qiziData = [];
/**已悔棋的数据 */
var huiqiData = [];
/**最新悔的棋子 */
var huiqidata = [];
/**连续棋子数量 */
var lianqi = 1;
/**连续棋子数组(x轴，y轴，左上到右下，左下到右上) */
var lianqiArry = [1, 1, 1, 1];
/**棋盘上位置的颜色信息 */
var data = new Array(sizeNumber);
for (var i = 0; i < sizeNumber; i++) {
    data[i] = new Array(sizeNumber);
}
for (var n = 0; n < sizeNumber; n++) {
    for (var m = 0; m < sizeNumber; m++) {
        data[n][m] = 3;
    }
}
/**
 * 棋盘的绘制
 */
var qipan = function () {
    for (var i = 0; i < (sizeNumber - 1) * (sizeNumber - 1); i++) {
        var qige = document.createElement('div');
        qige.className = 'qige';
        box.appendChild(qige);
    }
};
qipan();
/**
 * 棋子的绘制
 * @param x 坐标 X
 * @param y 坐标 Y
 * @param color 字体颜色
 */
var qizi = function (x, y, color) {
    var zi = document.createElement('div');
    zi.className = 'qizi';
    // zi.style.top = boxtop + size*y - qizir + 'px';
    // zi.style.left = boxleft + size*x - qizir + 'px';
    zi.style.top = size * y - qizir + 'px';
    zi.style.left = size * x - qizir + 'px';
    zi.style.backgroundColor = color;
    box.appendChild(zi);
    qiziData.push([zi, x, y, color]);
};
/**
 * 下棋
 */
box.onclick = function (e) {
    var x = e.clientX - box.offsetLeft;
    var y = e.clientY - box.offsetTop;
    var i = Math.round(x / size);
    var j = Math.round(y / size);
    if (data[i][j] == 3) {
        if (qiziColor == 'red') {
            qizi(i, j, 'red');
            qiziColor = 'black';
            data[i][j] = 1;
        }
        else {
            qizi(i, j, 'black');
            qiziColor = 'red';
            data[i][j] = 0;
        }
    }
    huiqiData = [];
    /**
     * 判断输赢
     */
    //judge(data[i][j], i, j)
    judge2(data[i][j], i, j);
};
/**
 * 悔棋
 */
btnhui.onclick = function () {
    if (qiziData.length != 0) {
        huiqidata = qiziData.pop();
        huiqiData.push(huiqidata);
        box.removeChild(huiqidata[0]);
        data[huiqidata[1]][huiqidata[2]] = 3;
        qiziColor = qiziColor == 'red' ? 'black' : 'red';
    }
    else {
        alert('已经没有可以悔的棋子了');
    }
};
/**
 * 撤销
 */
btnche.onclick = function () {
    if (huiqiData.length != 0) {
        huiqidata = huiqiData[huiqiData.length - 1];
        box.appendChild(huiqidata[0]);
        data[huiqidata[1]][huiqidata[2]] = huiqidata[3];
        qiziColor = huiqidata[3] == 'red' ? 'black' : 'red';
        huiqiData.pop();
        qiziData.push(huiqidata);
    }
    else {
        alert('已经没有可以撤销的棋子了');
    }
};
/**
 * 判断输赢
 * @param color 棋子颜色
 * @param x x坐标
 * @param y y坐标
 */
var judge = function (color, x, y) {
    judge_x(color, x, y);
    judge_y(color, x, y);
    judge_lxry(color, x, y);
    judge_rxly(color, x, y);
    //输赢颜色判断
    if (lianqi >= 5) {
        if (color == 0) {
            setTimeout(function () {
                alert('恭喜黑色棋子获胜！');
            }, 0);
        }
        else {
            setTimeout(function () {
                alert('恭喜红色棋子获胜！');
            }, 0);
        }
    }
    else {
        lianqi = 1;
    }
};
/**
 * x轴的判断
 * @param color 棋子颜色
 * @param x x轴坐标
 * @param y y轴坐标
 */
var judge_x = function (color, x, y) {
    for (n = x + 1; n < sizeNumber; n++) {
        if (color != data[n][y]) {
            break;
        }
        lianqi++;
    }
    for (n = x - 1; n >= 0; n--) {
        if (color != data[n][y]) {
            break;
        }
        lianqi++;
    }
    if (lianqi < 5) {
        lianqi = 1;
    }
};
/**
 * y轴判断
 * @param color 棋子颜色
 * @param x x轴坐标
 * @param y y轴坐标
 */
var judge_y = function (color, x, y) {
    for (n = y - 1; n >= 0; n--) {
        if (color == data[x][n]) {
            lianqi++;
        }
        else {
            break;
        }
    }
    for (n = y + 1; n >= sizeNumber; n++) {
        if (color == data[x][n]) {
            lianqi++;
        }
        else {
            break;
        }
    }
    if (lianqi < 5) {
        lianqi = 1;
    }
};
/**
 * 左上右下判断
 * @param color 棋子颜色
 * @param x x轴坐标
 * @param y y轴坐标
 */
var judge_lxry = function (color, x, y) {
    for (n = x - 1, m = y - 1; n >= 0 && m >= 0; n--, m--) {
        if (color != data[n][m]) {
            break;
        }
        lianqi++;
    }
    for (n = x + 1, m = y + 1; n < sizeNumber && m < sizeNumber; n++, m++) {
        if (color != data[n][m]) {
            break;
        }
        lianqi++;
    }
    if (lianqi < 5) {
        lianqi = 1;
    }
};
/**
 * 左下右上判断
 * @param color 棋子颜色
 * @param x x轴坐标
 * @param y y轴坐标
 */
var judge_rxly = function (color, x, y) {
    for (n = x - 1, m = y + 1; n >= 0 && m >= 0; n--, m++) {
        if (color != data[n][m]) {
            break;
        }
        lianqi++;
    }
    for (n = x + 1, m = y - 1; n < sizeNumber && m < sizeNumber; n++, m--) {
        if (color != data[n][m]) {
            break;
        }
        lianqi++;
    }
    if (lianqi < 5) {
        lianqi = 1;
    }
};
/**
 * 第二种输赢判断方法
 * @param color 棋子颜色
 * @param x x轴
 * @param y y轴
 */
var judge2 = function (color, x, y) {
    let x2 = x;
    let y2 = y;
    for (n = 0; n < 3; n++) {
        if (n == 0) { //x不变
            for (m = 0; m < 3; m++) {
                for (var z = 0; z < 4; z++) {
                    if (m == 0) { //y不变
                        x = x2;
                        y = y2;
                        break;
                    }
                    else if (m == 1) { //y减少
                        if (data[x][--y] == color) {
                            lianqiArry[1]++;
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                    else if (m == 2) { //y增加
                        if (data[x][++y] == color) {
                            lianqiArry[1]++;
                            console.log(1,z)
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                }
            }
        }
        else if (n == 1) {
            for (m = 0; m < 3; m++) {
                for (var z = 0; z < 4; z++) {
                    if (m == 0) { //y不变
                        if (data[--x][y] == color) {
                            lianqiArry[0]++;
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                    else if (m == 1) { //y减少
                        if (data[--x][--y] == color) {
                            lianqiArry[3]++;
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                    else if (m == 2) { //y增加
                        if (data[--x][++y] == color) {
                            lianqiArry[2]++;
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                }
            }
        }
        else if (n == 2) { //x增加
            for (m = 0; m < 3; m++) {
                for (var z = 0; z < 4; z++) {
                    if (m == 0) { //y不变
                        if (data[++x][y] == color) {
                            lianqiArry[0]++;
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                    else if (m == 1) { //y减少
                        if (data[++x][--y] == color) {
                            lianqiArry[2]++;
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                    else if (m == 2) { //y增加
                        if (data[++x][++y] == color) {
                            lianqiArry[3]++;
                        }
                        else {
                            x = x2;
                            y = y2;
                            break;
                        }
                    }
                }
            }
        }
    }

    for(n=0;n<4;n++){
        if(lianqiArry[n] >= 5){
            if (color == 0) {
                setTimeout(function () {
                    alert('恭喜黑色棋子获胜！');
                }, 1);
            }
            else {
                setTimeout(function () {
                    alert('恭喜红色棋子获胜！');
                }, 1);
            }
        }
    }

    lianqiArry = [1,1,1,1]
};
