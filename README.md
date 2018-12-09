# GitHubPopular-SJ

![](https://img.shields.io/badge/build-success-brightgreen.svg)
![](https://img.shields.io/badge/platform-iOS-30A3FC.svg)
![](https://img.shields.io/badge/platform-Android-8FC550.svg)
[![](https://img.shields.io/badge/blog-JianShu-EA6F5A.svg)](http://www.jianshu.com/p/241241aae095)
[![](https://img.shields.io/badge/blog-JueJin-007FFF.svg)](https://juejin.im/post/59a65113f265da247b4e98c1)
[![](https://img.shields.io/badge/License-MIT-ff69b4.svg)](https://github.com/knightsj/GitHubPopular-SJ/blob/master/LICENSE)

## 项目介绍

这是我在学习很火的实战课程[《React Native 开发跨平台 GitHubPopular》](http://coding.imooc.com/class/89.html)后，写出的课程Demo，大家也可加入该课程学习提高自己。非常感谢该项目作者**贾鹏辉**老师的精心制作。

>贾鹏辉老师还撰写了很多关于React Native的技术博客：[贾鹏辉老师的技术博客](http://www.devio.org/)，在里面可以学到很多关于React Native相关的知识。

已经实现了除调用友盟接口和集成CodePush的功能，并且对项目做了一点重构，而且做了一点优化。

更详细的中文介绍地址：[掘金：从一个实战项目来看一下React Native开发的几个关键技术点](https://juejin.im/post/59a65113f265da247b4e98c1)

目录结构：

![](https://jknight-blog.oss-cn-shanghai.aliyuncs.com/react_native/imooc_demo/rn_p_folder_detail2.png)



## 项目演示：

### 上排是iOS模拟器，下排是Android模拟器：

![](https://jknight-blog.oss-cn-shanghai.aliyuncs.com/react_native/imooc_demo/rn_p_header.png)

### 多主题切换：
![多主题切换](https://jknight-blog.oss-cn-shanghai.aliyuncs.com/react_native/imooc_demo/rn_p_theme.png)

### 交互展示：
![](https://jknight-blog.oss-cn-shanghai.aliyuncs.com/react_native/imooc_demo/rn_p_show.gif)



## 运行方法（iOS）

### 1. 添加依赖包
在项目根目录下执行：``npm install``方法。



### 2. 打包运行

有两种方法可以启动模拟器运行：
1. 在根目录下执行下面的命令:``react-native run-ios``，随后就可以自动启动本地服务，打开iOS模拟器运行项目。
2. 找到iOS项目文件夹，用Xcode打开项目，点击运行按钮运行（也可以连接iPhone运行）。




## To Do List

1. 性能优化：在真机上的性能还有待提升，会将接下来研究的重点放在性能优化上。
2. 加入Redux：性能提升以后，会引入Redux进行状态管理。
3. 主题相关：更换字体大小




## License

All source code is licensed under the [MIT License](https://github.com/knightsj/GitHubPopular-SJ/blob/master/LICENSE).





