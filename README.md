# NutPlacedAndBattleGame
Unfinished, developed by Cocos Creator

Nut

NormalNut
attack: 10

selected 选中  
compo 组件缩写  
suspendItem 悬浮物件  
canPlace 可以放置  
cursor on target 光标瞄准  
cursor aimed  
move radius 移动半径  


游戏规则

有一方的城堡被摧毁后游戏结束

花费金钱雇佣小人
单局回合可以进行如下操作：
每个小人可以移动一次
每个小人可以攻击一次
可以花费金币建造桥梁
可以花费金币建造城墙



桥梁


下一个版本：
卡片合成
每回合










可拓展：

正常情况下，每回合移动数和场地上nut的个数一致，即每个nut每回合只能移动一步
扩展的特殊道具可以让一个nut再移动一次
所以不用Boolean，用number吧

修改计划：将Nut的
hasMoveInThisRound: boolean改为
moveRemainder: number

每个nut的剩余移动数由State存储转为各个对象自行存储
原来的信息
MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_MOVECHANCE_CHANGED,dic);

MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_MOVECHANCE_CHANGED,null);
由State把所有对象的moveRemainder加起来即可

State想把所有NormalNut对象的MoveRemainder累加起来并不容易，因为cc.Node对象并没有moveRemainder属性，想这样处理需要用到接口


event.stopPropagation();可以阻止重叠对象点击多次生效，首次用在wall的preview上


static actionNut: ComponentBase = null;

NutManager.ts
ReceiveList: any[] = [];
为了兼容ManagerBase基类