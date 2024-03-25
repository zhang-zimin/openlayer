/**
 * 思路:通过简单的 el-table的 thead和tbody父级别区域，进行设置对于的fixed
 * 1.复制一份 thead 设置为fixed,先隐藏掉。
 * 2.创建滚动条监听事件，根据滚动条计算表格所在可视窗口位置。设置thead副本是否显示
 * 3.创建横向滚动条的属性变化监听。当监听变化时，说明在拖动横向滚动条，需要将设置对应副本的表头位置，防止错位
 */

function getElParentBySelector(el: any, queryClassSelector: string) {
    if (!el) {
      return el
    }
    if ([...el.classList].includes(queryClassSelector)) {
      return el
    }
    return getElParentBySelector(el.parentNode, queryClassSelector)
  }
  
  function getTableShowWidth(thead: string) {
    const tableBox = getElParentBySelector(thead, 'el-table')
    return tableBox.getBoundingClientRect().width
  }
  
  //使用setTime来确保不会重复设置
  
  function createTableSticky(el: any, binding: any, vNode?: any) {
    let stickyTop = binding.value.top || 0
    const zIndex = binding.value.zIndex || 0
    stickyTop = parseFloat(stickyTop)
    // 获取表格(element)
    let thead = el.querySelector('.el-table__header')
    thead = getElParentBySelector(thead, 'el-table__header-wrapper')
    const tbody = el.querySelector('.el-scrollbar') || el.querySelector('.el-table__body')
    // const tableBox = el.querySelector('.el-table__inner-wrapper')
  
    const elBodyBox = el.querySelector('.el-table__body-wrapper')
  
    /**
     * 插入副本元素，确保文档流不塌陷
     */
    const copyThead = thead.cloneNode(true)
    copyThead.classList.add('el-table_header-copy')
    copyThead.style.display = 'none'
    copyThead.style.position = 'fixed'
    copyThead.style.zIndex = zIndex || 1994
    copyThead.style.top = stickyTop + 'px'
    copyThead.style.backgroundColor = '#fff'
    copyThead.style.borderTop = '1px solid #999999'
  
    thead.parentNode.insertBefore(copyThead, elBodyBox)
  
    //获取thead 的显示宽度
    const headerShowWidth = getTableShowWidth(thead)
  
    // 获取滚动元素
    const scrollParent = document.querySelector(binding.value.parent || 'body')
    if (!scrollParent || binding.value.disabled === true) {
      return
    }
  
    scrollParent.addEventListener('scroll', function () {
      const theadHeight = thead.clientHeight
      // 获取thead距离顶部的距离
      const theadTop = thead.getBoundingClientRect().top
      // 判断是否需要回归原来位置
      const originally = tbody.getBoundingClientRect().top
      // 判断底部距离是否超过表头
      const goBeyond = tbody.getBoundingClientRect().bottom
  
      if (theadTop <= stickyTop) {
        copyThead.style.display = 'block'
        copyThead.style.width =
          (tbody.offsetWidth < headerShowWidth ? tbody.offsetWidth : headerShowWidth) + 'px'
      }
  
      if (originally - theadHeight > stickyTop || goBeyond - theadHeight / 2 <= stickyTop) {
        //影藏副本
        copyThead.style.display = 'none'
      } 
    })
  
    try {
      //启动底部滚动条监控，防止横向滚动条滚动，表头没有动的问题
      const elThumbBut = el.querySelector(
        '.el-table__body-wrapper .el-scrollbar .el-scrollbar__bar.is-horizontal .el-scrollbar__thumb'
      )
      if (elThumbBut) {
        const observer = new MutationObserver(mutationsList => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
              // CSS样式发生了变化
              // 将 thumb 滚动条的
              const transformX = elThumbBut.style.transform
              if (transformX) {
                copyThead.querySelector(
                  '.el-table__header'
                ).style.marginLeft = `-${transformX.replace(/[a-zA-Z()]/g, '')}`
              }
            }
          }
        })
        //开始监听横向滚动条
        observer.observe(elThumbBut, { attributes: true })
      }
    } catch (error) {}
  }
  
  export function createSticky(vue: any) {
    let clearTimeId = 0
    // el-table表头吸顶效果
    vue.directive('sticky', {
      // 当被绑定的元素插入到 DOM 中时……
      mounted(el: any, binding: any) {
        const random = parseInt(Math.random() * 10 + '')
        //TIP 延时设置，确保表格进行渲染成功！
        clearTimeId = setTimeout(() => {
          createTableSticky(el, binding)
          // clearTimeout(clearTimeId)
        }, 1000 + random)
      },
  
      update(el: any, binding: any) {
        const random = parseInt(Math.random() * 10 + '')
        //TIP 延时设置，确保表格进行渲染成功！
        clearTimeId = setTimeout(() => {
          createTableSticky(el, binding)
          // clearTimeout(clearTimeId)
        }, 1000 + random)
      },
  
      unmounted(el: any, binding: any) {
        clearTimeId && clearTimeout(clearTimeId)
      }
    })
  }
  
  