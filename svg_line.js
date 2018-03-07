    function drawLine (a, b, option) {
              var container = document.querySelector('.devops-pipeline-view-content');
              var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.classList.add('path');
              var abs = number => {
                return Math.abs(number);
              };
              if(option){
                option = {
                  r: option.r || 20,
                  isDetail: option.isDetail || false,
                  strokeWidth: option.strokeWidth || 2,
                  stroke: option.stroke || '#7aa925',
                  isArrow: option.isArrow
                };
              }else{
                option = {
                  r: 20,
                  isDetail: false,
                  strokeWidth: 2,
                  stroke: '#7aa925',
                  isArrow: false
                };
              }
              function Position () {
                this.offsetX_a = a.offsetLeft;
                this.offsetX_b = b.offsetLeft;
                this.offsetY_a = a.offsetTop;
                this.offsetY_b = b.offsetTop;
                this.x1 = a.offsetLeft;
                this.y1 = a.offsetTop + (a.offsetHeight / 2);
                this.x2 = b.offsetLeft;
                this.y2 = b.offsetTop + (b.offsetHeight / 2);
                if(this.offsetX_a < this.offsetX_b) {
                  this.x1 = a.offsetLeft + a.offsetWidth;
                }
                this.overall_length_x = this.x1 - this.x2;
                this.overall_length_y = this.y1 - this.y2;
                this.halfWidth = option.r / 10;
                this.r = option.r || 5;
              }

              var p = new Position();
              var anticlockwise = [];
              var direction;
              if (p.x1 > p.x2 && p.y1 > p.y2){
                direction = 1;
              }
              if (p.x1 < p.x2 && p.y1 < p.y2) {
                direction = 2;
              }
              if (p.x1 > p.x2 && p.y1 < p.y2) {
                direction = 3;
              }
              if (p.x1 < p.x2 && p.y1 > p.y2) {
                direction = 4;
              }
              if (abs(p.offsetX_a - p.offsetX_b) <= 20 || abs(p.offsetY_a - p.offsetY_b) <= 20) {
                direction = 5;
              }
              if (p.offsetX_a === p.offsetX_b || p.offsetY_a === p.offsetY_b) {
                direction = 5;
              }

              if ((p.x1 > p.x2 && p.y1 > p.y2) || (p.x1 < p.x2 && p.y1 < p.y2)) {
                anticlockwise = [1, 0];
              } else {
                anticlockwise = [0, 1];
              }

              var getPath = (clockwise, dire) => {
                var s = {
                    move_to: function(x, y){
                        return ['M', x, ',', y, ' '].join('');
                    },
                    line_to: function(x, y){
                        return ['L', x, ',', y, ' '].join('');
                    },
                    arc: function(r, wise, x, y){
                        return ['A', r, ' ', r, ' 0 0,', wise, ' ', x, ',', y, ' '].join('');
                    }
                };
                var x1, y1, x2, y2, d;
                switch(dire){
                  case 1:
                    x1 = abs(p.overall_length_x);
                    y1 = abs(p.overall_length_y);
                    x2 = 0;
                    y2 = 0;
                    p.halfWidth = abs(p.halfWidth);
                    d = s.move_to(x1, y1);
                    d += s.line_to(p.halfWidth, y1);
                    d += s.move_to(p.halfWidth, y1);
                    d += s.arc(p.r, clockwise[0], p.halfWidth - p.r, y1 - p.r);
                    d += s.move_to(p.halfWidth - p.r, y1 - p.r);
                    d += s.line_to(p.halfWidth - p.r, y2 + p.r);
                    d += s.arc(p.r, clockwise[1], p.halfWidth - p.r - p.r, 0);
                    d += s.line_to(x2, y2);
                    break;
                  case 2:
                    x1 = 0;
                    y1 = 0  + option.strokeWidth;
                    x2 = abs(p.overall_length_x);
                    y2 = abs(p.overall_length_y)  + option.strokeWidth;
                    p.halfWidth = abs(p.halfWidth);
                    d = s.move_to(x1, y1);
                    d += s.line_to(p.halfWidth, y1);
                    d += s.move_to(p.halfWidth, y1);
                    d += s.arc(p.r, clockwise[0], p.halfWidth + p.r, y1 + p.r);
                    d += s.move_to(p.halfWidth + p.r, y1 + p.r);
                    d += s.line_to(p.halfWidth + p.r, y2 - p.r);
                    d += s.arc(p.r, clockwise[1], p.halfWidth + p.r + p.r, y2);
                    d += s.line_to(x2, y2);
                    break;
                  case 3:
                    x1 = abs(p.overall_length_x);
                    y1 = 0 + option.strokeWidth;
                    x2 = 0;
                    y2 = abs(p.overall_length_y) + option.strokeWidth;
                    p.halfWidth = abs(p.overall_length_x) - abs(p.halfWidth);
                    d = s.move_to(x1, y1);
                    d += s.line_to(p.halfWidth, y1);
                    d += s.move_to(p.halfWidth, y1);
                    d += s.arc(p.r, clockwise[0], p.halfWidth - p.r, y1 + p.r);
                    d += s.move_to(p.halfWidth - p.r, y1 + p.r);
                    d += s.line_to(p.halfWidth - p.r, y2 - p.r);
                    d += s.arc(p.r, clockwise[1], p.halfWidth - p.r - p.r, y2);
                    d += s.line_to(x2, y2);
                    break;
                  case 4:
                    x1 = 0;
                    y1 = abs(p.overall_length_y);
                    x2 = abs(p.overall_length_x);
                    y2 = 0;
                    p.halfWidth = abs(p.halfWidth);
                    d = s.move_to(x1, y1);
                    d += s.line_to(p.halfWidth, y1);
                    d += s.move_to(p.halfWidth, y1);
                    d += s.arc(p.r, clockwise[0], p.halfWidth + p.r, y1 - p.r);
                    d += s.move_to(p.halfWidth + p.r, y1 - p.r);
                    d += s.line_to(p.halfWidth + p.r, y2 + p.r);
                    d += s.arc(p.r, clockwise[1], p.halfWidth + p.r + p.r, 0);
                    d += s.line_to(x2, y2);
                    break;
                  case 5:
                    x1 = 0;
                    y1 = 0 + option.strokeWidth;
                    x2 = abs(p.overall_length_x);
                    y2 = abs(p.overall_length_y)  + option.strokeWidth;
                    if(option.isArrow){
                      x2 -= 6;
                      y1 += 8;
                      y2 += 8;
                    }
                    if(x1 === x2){
                      x1 += option.strokeWidth;
                      x2 += option.strokeWidth;
                    }
                    d = s.move_to(x1, y1);
                    d += s.line_to(x2, y2);
                    break;
                  case 6:
                    //详情页线条
                    x1 = abs(p.overall_length_x) - 100;
                    y1 = 0 + option.strokeWidth;
                    x2 = 100;
                    y2 = abs(p.overall_length_y) + option.strokeWidth;
                    d = s.move_to(x1, y1);
                    x1 = x1 + 20; // 固定X出20距离
                    d += s.line_to(x1, y1); // 绘制
                    d += s.move_to(x1, y1);
                    d += s.arc(p.r, 1, x1 + p.r, y1 + p.r);// 固定绘制p.r弧度的半圆
                    d += s.move_to(x1 + p.r, y1 + p.r);
                    d += s.line_to(x1 + p.r, y1 + 30 + p.r);// 固定绘制向下30PX的直线
                    d += s.move_to(x1 + p.r, y1 + 30 + p.r);
                    d += s.arc(p.r, 1, x1, y1 + 30 + p.r + p.r);// 固定绘制p.r弧度的半圆
                    d += s.move_to(x1, y1 + 30 + p.r + p.r);
                    d += s.line_to(0 + p.r + option.strokeWidth, y1 + 30 + p.r + p.r);// 固定绘制直线,保留一个p.r弧度的距离
                    d += s.move_to(0 + p.r + option.strokeWidth, y1 + 30 + p.r + p.r);
                    d += s.arc(p.r, 0, 0 + option.strokeWidth, y1 + 30 + p.r + p.r + p.r);//不固定,通过计算得出与下一个直线的距离
                    d += s.move_to(0 + option.strokeWidth, y1 + 30 + p.r + p.r + p.r);
                    d += s.line_to(0 + option.strokeWidth, y2 - p.r); //保留一个p.r弧度的距离
                    d += s.move_to(0 + option.strokeWidth, y2 - p.r);
                    d += s.arc(p.r, 0, p.r, y2);
                    d += s.move_to(p.r, y2);
                    d += s.line_to(x2, y2);
                    break;
                  default:
                    break;
                }
                return d;
              };
              if(option.isDetail){
                p.x1 = a.offsetLeft + a.offsetWidth;
                p.overall_length_x = p.x1 - p.x2 + 200;
                path.setAttribute('d', getPath(anticlockwise, 6));
              }else{
                path.setAttribute('d', getPath(anticlockwise, direction));
              }
              var svgWidth = p.overall_length_x;
              var svgHeight = p.overall_length_y;
              var left = svgWidth > 0 ? p.x2 : p.x1;
              var top  = svgHeight> 0 ? p.y2 : p.y1;
              if(svgHeight === 0){
                svgHeight = 10;
              }
              if(svgWidth === 0){
                svgWidth = 10;
                left = a.offsetWidth / 2 - option.strokeWidth;
              }
              if(option.isDetail){
                left = (left - 200 / 2);
              }
              svgWidth = abs(svgWidth);
              svgHeight = abs(svgHeight) + (option.strokeWidth * 2);
              top -= (option.strokeWidth);
              if(option.isArrow){
                svg.innerHTML = '<defs><marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="6" refY="6" orient="auto"><path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #97a5c2;"/></marker></defs>';
                path.setAttribute('marker-end', 'url(#arrow)');
                top -= 8;
                svgHeight += 8;
              }
              svg.style = "position: absolute; width: " + svgWidth + "px; height: " + svgHeight + "px;" + 'left: ' + left + 'px; top:' + top + 'px;';
              path.style =  'stroke-width: ' + option.strokeWidth +';stroke: ' + option.stroke + ';';
              svg.appendChild(path);
              container.appendChild(svg);
            }
export {
  drawLine
};
