////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Create a chat application using the utility methods we give you.
//
// Already done?
//
// - Create a filter that lets you filter messages in the chat by
//   sender and/or content
//
////////////////////////////////////////////////////////////////////////////////
var React = require('react');
var sortBy = require('sort-by');
var { login, sendMessage, subscribeToMessages } = require('./utils/ChatUtils');

require('./styles');

var Chat = React.createClass({

    getInitialState () {
        return {
            auth: null
        };
    },

    componentDidMount () {
        var t = this;

        login((error, auth) => {
            t.setState({
                auth: auth
            });
        });
    },

    render () {
        if (!this.state.auth) {
            return null;
        }
        return <div className="chat">
            <Room
                auth={this.state.auth}
            />
        </div>
    }

});

var Room = React.createClass({

    _unsubscribe: null,

    propTypes: {
        auth: React.PropTypes.object,
        filters: React.PropTypes.array
    },

    getDefaultProps () {
        return {
            auth: null
        }
    },

    getInitialState () {
        var filterOptions = ['name', 'message'];
        return {
            messages: [],
            filters: {
                options: filterOptions,
                active: filterOptions[0],
                value: ''
            }
        };
    },

    componentDidMount () {
        this.subscribeToMessages('general');
    },

    componentWillReceiveProps (nextProps) {
        this.subscribeToMessages(nextProps.params.room);
    },

    subscribeToMessages (room) {
        if (this._unsubscribe) {
            this._unsubscribe();
        }

        this._unsubscribe = subscribeToMessages(room, (messages) => {
            this.setState({ messages });
        });
    },

    handleSubmit (e) {
        e.preventDefault();
        e.stopPropagation();

        var messageTextNode = React.findDOMNode(this.refs.messageText),
            messageText = messageTextNode.value,
            username = this.props.auth.github.username,
            avatar = this.props.auth.github.profileImageURL;

        messageTextNode.value = '';
        sendMessage('general', username, avatar, messageText);
    },

    handleFilterChange (e) {
        this.state.filters.active = e.active;
        this.state.filters.value = e.value;
        var messages = this.state.messages.filter(function (message) {
            if (e.active && e.value) {
                if (e.active === message.active || e.value === message.value) {
                    return true;
                }
                return false;
            }
            return true;
        });
        this.setState({
            filters: this.state.filters,
            messages: messages
        });
    },

    render () {
        var { auth} = this.props;
        var { messages, filters} = this.state;

        return <div className="room">
            <h1 className="room-title">general</h1>
            <Filter
                filters={filters}
                onChange={this.handleFilterChange}
            />
            <div ref="messages" className="messages">
                <MessageList auth={auth} messages={messages} />
            </div>
            <form className="new-message-form" onSubmit={this.handleSubmit}>
                <div className="new-message">
                    <input ref="messageText" type="text" placeholder="Type your message here..." />
                    <input type="submit" style={{
                        position: 'absolute',
                        left: -9999,
                        width: 1,
                        height: 1
                    }} tabIndex="-1" />
                </div>
            </form>
        </div>
    }

});

var MessageListItem = React.createClass({

    propTypes: {
        authoredByViewer: React.PropTypes.bool,
        message: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            authoredByViewer: false,
            message: ''
        }
    },

    render () {
        var { authoredByViewer, message } = this.props;
        var classNames = ['message'];

        if (authoredByViewer) {
            classNames.push('own-message');
        }

        return (
            <li className={classNames.join( )}>
                <div className="message-avatar">
                    <img src={message.avatar} width="40" />
                </div>
                <div className="message-content">
                    <div className="message-username">
                        {message.username}
                    </div>
                    <div className="message-text">
                        {message.text}
                    </div>
                </div>
            </li>
        );
    }

});

var MessageList = React.createClass({

    propTypes: {
        auth: React.PropTypes.object,
        messages: React.PropTypes.array
    },

    getDefaultProps () {
        return {
            auth: null,
            messages: []
        }
    },

    render () {
        var { auth, messages } = this.props;

        var viewerUsername = auth.github.username;
        var items = messages.sort(sortBy('timestamp')).map((message, index) => {
            return <MessageListItem
                key={index}
                authoredByViewer={message.username === viewerUsername}
                message={message}
            />;
        });

        return (
            <ol className="message-list">
                {items}
            </ol>
        );
    }

});

var Filter = React.createClass({

    propTypes: {
        filters: React.PropTypes.array,
        onChange: React.PropTypes.function
    },

    getDefaultProps () {
        return {
            filters: [],
        }
    },

    getInitialState () {
        return {
            active: this.props.filters.active,
            value: this.props.filters.value
        }
    },

    onSelect (e) {
        this.setState({
            active: e.target.value
        });
        this.props.onChange && this.props.onChange({
            active: this.state.active,
            value: this.state.value
        });
    },

    onInputChange (e) {
        this.setState({
            value: e.target.value
        });
        this.props.onChange && this.props.onChange({
            active: this.state.active,
            value: this.state.value
        });
    },

    render () {
        return <div className="filter">
            <select onChange={this.onSelect}>
            {this.props.filters.options.map(function (filter) {
                return <option>{filter}</option>
            })}
            </select>
            <input
                ref="input"
                type="text"
                value={this.state.value}
                onChange={this.onInputChange}
                placeholder="Please type for filter..." 
            />
        </div>
    }

});

React.render(<Chat/>, document.getElementById('app'));

/*

Here's how to use the ChatUtils:

login((error, auth) => {
  // hopefully the error is `null` and you have a github
  // `auth` object
});

sendMessage(
  'general', // the channel to post a message to, please post to "general" at first
  'ryanflorence', // the github user name
  'https://avatars.githubusercontent.com/u/100200?v=3', // the github avatar
  'hello, this is a message' // the actual message
);

var unsubscribe = subscribeToMessages('general', (messages) => {
  // here are your messages as an array, it will be called
  // every time the messages change
});
unsubscribe(); // stop listening for changes

The world is your oyster!

*/

