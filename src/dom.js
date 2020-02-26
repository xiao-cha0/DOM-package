//封装全局dom
window.dom = {
  create(string){//标签名以字符串string形式传入
    //传入一个标签'div'，我给你创建一个div，并命名为container
    const container =  document.createElement("template");//template标签中可以容纳任意标签
    //把传入的标签赋值给创建的div的HTML元素
    container.innerHTML = string.trim();//trim()这个api可以将创建时的空白文本删除（如：空格、回车等）
    //返回创建的div的第一个儿子
    return container.content.firstChild;
  },
  after(node,node2){//将node2插入到node的后面
    //找到node的爸爸调用爸爸的insertBefore方法，将node2插入到node的下一个兄弟姐妹的前面
    //insertBefore这个api就是在某某节点之前插入
    node.parentNode.insertBefore(node2,node.nextSibling);
  },
  before(node,node2) {//将node2插入到node的前面
    node.parentNode.insertBefore(node2,node);
  },
  append(parent,node){//新增一个儿子
    parent.appendChild(node);
  },
  wrap(node,parent){//新增一个爸爸
    dom.before(node,parent);//先将它爸爸放在node的前面，使其成为sibling
    dom.append(parent,node);//再将node变成儿子
  },
  remove(node){//删除节点node
    node.parentNode.removeChild(node);
    return node;//返回删掉的儿子们，方便后面引用
  },
  //删除所有儿子们
  empty(node){
    //获取所有儿子们
   // const  {childNodes} = node;//等价于const childNode = node.childNodes,此处使用新语法
    const array = [];//创建一个空数组，用来放删掉的儿子们，方便后面引用
    let x =node.firstChild;//把第一个儿子赋值给x
    while(x){//遍历，如果x存在
      array.push(dom.remove(x));//把x删掉，并添加到数组array
      x = node.firstChild;//让x指向删掉后新的第一个儿子
    }
    return array;//返回这个数组，方便调用
  },
  //改node中的属性
  //下面使用到的方法就是重载
  attr(node,name,value){//接受3个参数，分别是：node节点、属性名、属性值
    if(arguments.length === 3){//如果参数的长度等于3
      node.setAttribute(name,value);//改属性
    }else if(arguments.length === 2){//如果参数的长度等于2
      return node.getAttribute(name);//度属性
    }
  },
  //下面使用到的方法就是适配
  text(node,string){//修改文本节点的属性值
    if(arguments.length === 2){//判断其参数的长度，如果等于2就是修改属性值
      if('innerText' in node){//判断'innerText'这个api是否在node这个节点里面（innerText是IE提供的，担心其他浏览器不支持）
        node.innerText = string;//用innerText修改其属性值
      }else {//否则就是没有上面的innerText api
        node.textContent = string;//用textContent修改其属性值
      }
    }else if(arguments.length === 1){//判断其参数的长度，如果等于2就是获取属性值
      if('innerText' in node){//判断'innerText'这个api是否在node这个节点里面（innerText是IE提供的，担心其他浏览器不支持）
        return node.innerText;//用innerText获取其属性值
      }else {//否则就是没有上面的innerText api
        return node.textContent;//用textContent获取其属性值
      }
    }
  },
  //改html元素
  html(node,string){
    if(arguments.length === 2){//断其参数的长度，如果等于2就是修改元素值
      node.innerHTML = string;
    }else if(arguments.length === 1){//断其参数的长度，如果等于1就是获取属性值
      return node.innerHTML;
    }
  },
  //改，读，写元素的style属性
  style(node,name,value){//接受3个参数：node、属性名、属性值
    if(arguments.length === 3){//判断：如果参数长度等于3
      //dom.style(div,color 'red')
      node.style[name] = value;
    }else if(arguments.length === 2){//判断：如果参数长度等于2
      //dom.style(div,color)
      return node.style[name];
    }else  if(typeof name in object){//判断：如果参数name的类型是对象，说明对象内包含多个属性
      //dom.style(object)
      for(let key in name){//遍历name参数
        dom.style[key] = name[key];//让参数name中属性就等于节点node.style的属性
      }
    }
  },
  //添加、删除、判断
  class:{
    //添加className
    add(node,className){
      node.classList.add(className);
    },
    //删除className
    remove(node,className){
      node.classList.remove(className);
    },
    //判断是否有className
    contains(node,className){
     return node.classList.contains(className);
    },
  },
  //添加事件监听
  on(node,eventName,fn){
    node.addEventListener(eventName,fn);
  },
  //移除事件监听
  off(node,eventName,fn){
    node.removeEventListener(eventName,fn);
  },
  //查找元素
  find(selector,scope){//selector是选择器,scope是代表查找范围
    //如果scope存在，就先到scope中去找，否则就在document中去找
    return (scope||document).querySelectorAll(selector);
},
  //找爸爸
  parent(node){
    return node.parentNode;
  },
  //找孩子们
  children(node){
    return node.children;
  },
  //查兄弟姐妹
  siblings(node){
    //先找到所有孩子们,并把它通过Array.from变成真正的数组
    // 通过filter筛选出自己（也就是node）
    Array.from(node.parentNode.children).filter((n)=>n!==node);
  },
  //找弟弟
  next(node){
    let x = node.nextSibling;//让x代替这个弟弟
    while (x && x.nodeType === 3){//判断：如果弟弟是存在的，且它的类型是文本
      x = x.nextSibling;//就让x再次指向下一个弟弟，继续循环，直到不是文本就停止
    }
    return x;//判断：如果所有弟弟中都是文本就表示没有找到其他元素，那就直接返回x
  },
  //找哥哥
  previous(node){
    let x = node.previous;//让x代替这个哥哥
    while (x && x.nodeType === 3){//判断：如果哥哥是存在的，且它的类型是文本
      x = x.previous;//就让x再次指向上一个哥哥，继续循环，直到不是文本就停止
    }
    return x;//判断：如果所有哥哥中都是文本就表示没有找到其他元素，那就直接返回x
  },
  //遍历所有节点node
  each(nodeList,fn){//接受两个参数：nodeList（所有节点的列表）、fn
    for(let i = 0;i<nodeList.length;i++){//遍历节点列表
      fn.call(null,nodeList[i]);//对遍历到的每一项我去调用fn
    }
  },
  //找节点node在兄弟中排行老几
  index(node){
    //获取到所有儿子们
    const list = dom.children(node.parentNode);
    //遍历所有儿子们
    let i;
    for(i = 0;i<list.length;i++){
      //如果儿子们中第i个刚好 === node
      if(list[i] === node){
        break;//停止遍历
      }
    }
    return i;//返回它的下标
  },
};

