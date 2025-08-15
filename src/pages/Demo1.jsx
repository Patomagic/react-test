import React from 'react';

// 父组件 - 用于传递props和触发子组件更新
class ParentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parentCount: 0,
      message: "初始消息"
    };
    console.log('Parent - constructor');
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('Parent - getDerivedStateFromProps', { nextProps, prevState });
    // 根据props更新state的示例
    if (nextProps.initValue !== prevState.parentCount) {
      return { parentCount: nextProps.initValue };
    }
    return null;
  }

  componentDidMount() {
    console.log('Parent - componentDidMount');
    // 模拟挂载后的数据请求
    setTimeout(() => {
      this.setState({ message: "挂载后更新的消息" });
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Parent - shouldComponentUpdate', { nextProps, nextState });
    // 控制是否允许更新
    return nextState.parentCount !== this.state.parentCount || 
           nextState.message !== this.state.message;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('Parent - getSnapshotBeforeUpdate', { prevProps, prevState });
    // 返回值会传递给componentDidUpdate
    return `快照: 旧count=${prevState.parentCount}`;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('Parent - componentDidUpdate', { prevProps, prevState, snapshot });
  }

  componentWillUnmount() {
    console.log('Parent - componentWillUnmount');
  }

  handleParentIncrement = () => {
    // 测试setState的批量更新
    this.setState({ parentCount: this.state.parentCount + 1 });
    this.setState(prevState => ({ parentCount: prevState.parentCount + 1 }));
  };

  render() {
    console.log('Parent - render');
    return (
      <div style={{ border: '2px solid blue', padding: '10px', margin: '10px' }}>
        <h3>父组件</h3>
        <p>Parent Count: {this.state.parentCount}</p>
        <p>Message: {this.state.message}</p>
        <button onClick={this.handleParentIncrement}>
          父组件计数+2（测试批量更新）
        </button>
        <ChildComponent 
          childCount={this.state.parentCount * 2} 
          onChildClick={() => this.setState({ parentCount: 0 })}
        />
      </div>
    );
  }
}

// 子组件 - 接收props并管理自己的状态
class ChildComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childInput: '',
      isActive: false
    };
    console.log('Child - constructor');
  }

  componentDidMount() {
    console.log('Child - componentDidMount');
  }

  componentDidUpdate(prevProps) {
    console.log('Child - componentDidUpdate', { prevProps, currentProps: this.props });
    // 监听props变化
    if (prevProps.childCount !== this.props.childCount) {
      console.log('子组件检测到childCount变化:', this.props.childCount);
    }
  }

  handleInputChange = (e) => {
    this.setState({ childInput: e.target.value });
  };

  handleToggle = () => {
    this.setState(prevState => ({ isActive: !prevState.isActive }));
  };

  render() {
    console.log('Child - render');
    const { childCount, onChildClick } = this.props;
    const { childInput, isActive } = this.state;

    return (
      <div style={{ border: '2px solid green', padding: '10px', margin: '10px' }}>
        <h4>子组件</h4>
        <p>Child Count (来自父组件): {childCount}</p>
        <p>状态切换: {isActive ? '激活' : '未激活'}</p>
        <input
          type="text"
          value={childInput}
          onChange={this.handleInputChange}
          placeholder="输入测试state"
        />
        <button onClick={this.handleToggle} style={{ marginLeft: '10px' }}>
          切换状态
        </button>
        <button onClick={onChildClick} style={{ marginLeft: '10px' }}>
          重置父组件计数
        </button>
      </div>
    );
  }
}

// 根组件 - 用于控制组件挂载/卸载
class DebugApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponents: true,
      initValue: 0
    };
  }

  toggleComponents = () => {
    this.setState(prevState => ({ showComponents: !prevState.showComponents }));
  };

  resetInitValue = () => {
    this.setState({ initValue: Math.floor(Math.random() * 10) });
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>React类组件调试Demo</h2>
        <button onClick={this.toggleComponents}>
          {this.state.showComponents ? '卸载组件' : '挂载组件'}
        </button>
        <button onClick={this.resetInitValue} style={{ marginLeft: '10px' }}>
          重置初始值（测试getDerivedStateFromProps）
        </button>
        {this.state.showComponents && (
          <ParentComponent initValue={this.state.initValue} />
        )}
      </div>
    );
  }
}

export default DebugApp;
