const div = dom.create("<div>newDiv</div>");
dom.after(test,div);
const div3 = dom.create("<div id=parent></div>");
dom.wrap(test,div3);
console.log(dom.empty(empty));
dom.attr(test,'title','xiaochaochao');
const title = dom.attr(test,'title');
console.log(title);
dom.text('text','hahahah');