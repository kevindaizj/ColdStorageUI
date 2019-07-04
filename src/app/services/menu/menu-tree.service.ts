import { Injectable } from '@angular/core';
import { DCMenu } from 'app/models/DCMenu';

@Injectable({
    providedIn: 'root'
})
export class DCMenuTreeService {

    constructor() {

    }

    convertTreeToList(root: object, menuProcessor: (menu: DCMenu) => void = null): DCMenu[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array, menuProcessor);
            if (node.Children) {
                for (let i = node.Children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.Children[i], level: node.level + 1, expand: false, parent: node });
                }
            }
        }

        return array;
    }

    private visitNode(menu: DCMenu, hashMap: object, array: DCMenu[], menuProcessor: (menu: DCMenu) => void): void {
        if (!hashMap[menu.Id]) {
            hashMap[menu.Id] = true;
            array.push(menu);
        }

        if (menuProcessor) {
            menuProcessor(menu);
        }
    }

    collapse(menuArray: DCMenu[], menu: DCMenu, isCollapse: boolean): void {
        if (isCollapse === false) {
            if (menu.Children) {
                menu.Children.forEach(d => {
                    const target = menuArray.find(a => a.Id === d.Id);
                    target.expand = false;
                    this.collapse(menuArray, target, false);
                });
            } else {
                return;
            }
        }
    }

}