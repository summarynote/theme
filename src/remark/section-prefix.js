import {visit} from 'unist-util-visit';

import fs from 'fs';
import path from 'path';

const plugin = (options) => {
  const transformer = async (ast, vfile) => {
    let exts = {
      'cpp': 'C++',
      'py': 'Python',
      'java': 'Java',
      'js': 'JavaScript',
    };

    visit(ast, 'code', (node, index, parent) => {
      if (node.lang === 'codetabs') {
        let name = null;
        let codeMeta = null;
        let groupIdNode = null;

        if (node.meta !== null) {
          let metas = node.meta.split(' ');
          for (let i of metas) {
            if (i.includes('name')) {
              name = i.split('=').slice(-1);
              // name = name[0];
            }

            if (i.includes('showLineNumbers')) {
              codeMeta = 'showLineNumbers';
            }

            if (i.includes('groupId')) {
              groupIdNode = {
                type: 'mdxJsxAttribute',
                name: 'groupId',
                value: i.split('=').slice(-1).toString(),
              };
            }
          }
          // console.log(`hello ${metas}`);
          // console.log(`hello ${metas[0]}`);
          // console.log(`hello4 ${Object.keys(node)}`);
        }


        let newTabsNode = {
          type: 'mdxJsxFlowElement',
          name: 'Tabs',
          attributes: [
            // {
            //   type: 'mdxJsxAttribute',
            //   name: 'groupId',
            //   value: 'operating-systems',
            // },
          ],
          children: [],
        };

        if (groupIdNode !== null) {
          newTabsNode.attributes.push(groupIdNode);
        }

        let dirName = path.dirname(vfile.path);
        let files = fs.readdirSync(dirName);
        let filteredFiles = [];

        for (let ext of Object.keys(exts)) {
          for (let file of files) {
            if (file.includes(ext)) {
              if (name === null) {
                filteredFiles.push(file);
              } else if (file.includes(name[0].slice(1, -1))) {
                filteredFiles.push(file);
              }
            }
          }
        }

        // console.log(`bye2 :${Object.keys(name)}`);
        // console.log(`bye1 :${name}`);
        if (name !== null) {
          // console.log(`bye3 :${typeof name[0]}`);
        }
        // console.log(`bye2 :${filteredFiles}`);

        for (let file of filteredFiles) {
          try {
            const data = fs.readFileSync(`${dirName}/${file}`, 'utf8');
            let fileExt = path.extname(file).slice(1);
            // console.log(`data: ${data}`);
            newTabsNode.children.push(
              { // TabItem
                type: 'mdxJsxFlowElement',
                name: 'TabItem',
                attributes: [
                  {
                    type: 'mdxJsxAttribute',
                    name: 'value', // should have unique value
                    value: file,
                  },
                  {
                    type: 'mdxJsxAttribute',
                    name: 'label',
                    value: exts[fileExt],
                  },
                ],
                children: [
                  { // code
                    type: 'code',
                    lang: fileExt,
                    meta: codeMeta, // string
                    value: data,
                  }, // end code
                ],
                // position: [],
                // data: [],
              } // end TabItem
            );
          } catch (err) {
            console.error(err);
          }
        }

        parent.children[index] = newTabsNode;
      };
    });
  };
  return transformer;
};

export default plugin;