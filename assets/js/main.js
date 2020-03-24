var itemTree = (
    function () {
        var root = document.getElementById("root");
        var itemCount = 10;
        var nodeList = [];
        var tree;

        var randomItemGenerator = function (itemCount) {
            nodeList = [];
            for (var i = 0; i < itemCount; i++) {
                var parentId = parseInt(Math.random() * itemCount);
                var parentId = parseInt(Math.random() * itemCount * 10 / 9); // reduce loop chance
                parentId = parentId == i ? parentId + 1 : parentId
                nodeList.push({
                    id: i,
                    name: 'item-' + i,
                    parentId: parentId
                })
            }
        };

        function checkTreeLoop() {
            for (let i = 0; i < nodeList.length; i++) {
                if (checkNodeRecursive([], nodeList[i]) === false) {
                    console.log("loop");
                    return false;
                }
            }
            return true;
        }

        function checkNodeRecursive(parentTree, node) {
            var matchIndex = parentTree.findIndex(x => x == node.id)
            if (matchIndex < 0) {
                var parentIndex = nodeList.findIndex(x => x.id == node.parentId);
                if (parentIndex < 0) {
                    return true;
                } else {
                    return checkNodeRecursive([...parentTree, node.id], nodeList[parentIndex]);
                }
            } else {
                return false;
            }
        }

        function updateItemCount(e) {
            itemCount = e.target.value;
            run();
        }

        function convertToTree(list) {

            var tempList = list.map(function (e, i) {
                return {
                    ...e,
                    children: []
                }
            });

            tree = tempList.filter(function (e, i) {
                var parentIndex = tempList.findIndex(x => x.id == e.parentId);
                if (parentIndex < 0) {
                    return true;
                } else {
                    tempList[parentIndex].children = tempList[parentIndex].children ? [...tempList[parentIndex].children, e] : [e];
                    return false;
                }
            });
        }

        function renderView() {
            root.innerHTML = "";
            root.append(document.createElement("hr"));
            root.append(createTreeDomElements());
            root.append(document.createElement("hr"));
            root.append(JSON.stringify(tree));
        }

        function createTreeDomElements(currentTree) {
            if (!currentTree) {
                var ul = document.createElement("ul");
                // ul.innerText = tree.name;
                for (let i = 0; i < tree.length; i++) {
                    var li = document.createElement("li");
                    li.innerText = tree[i].name;
                    li.append(createTreeDomElements(tree[i]));
                    ul.append(li);
                }
                //exit
                return ul;
            } else {
                var ul = document.createElement("ul");
                // ul.innerText = currentTree.name;
                for (let i = 0; i < currentTree.children.length; i++) {
                    var li = document.createElement("li");
                    li.innerText = currentTree.children[i].name;
                    li.append(createTreeDomElements(currentTree.children[i]));
                    ul.append(li);
                }
                return ul;
            }
        }

        function run() {
            do {
                randomItemGenerator(itemCount);
            } while ((checkTreeLoop() == false));

            convertToTree(nodeList);
            renderView();
        }
        run();
        return {
            updateItemCount,
            run
        };
    }
)();


var select = document.getElementById("js-item--count");
select.addEventListener("change", itemTree.updateItemCount);

var button = document.getElementById("js-refresh");
button.addEventListener("click", itemTree.run);

