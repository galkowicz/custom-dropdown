import React, {Component} from 'react';

/**
 * The code is pretty simple and self explanatory. functions and variables names 'say' what the code does.
 */
class UISelect extends Component {
    constructor(props) {
        super(props);

        this.openOptions = this.openOptions.bind(this);
        this.closeOptions = this.closeOptions.bind(this);
        this.handleNavigate = this.handleNavigate.bind(this);

        this.state = {selected: 0, isOpen: false, highlighted: 0}
    }

    componentDidMount() {
        window.document.addEventListener('click', (event) => {
            this.closeOptions(event);
        });
        window.document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        if (event.key === 'ArrowDown') {
            document.activeElement === this.refs.select && this.openOptions(event);
        }
    }

    closeOptions(event) {
        let currentSelect = this.findSelect(event.target);
        // close only if selecting item from list or not selecting the current select
        if (event.target.nodeName === 'LI' || this.currentTarget !== currentSelect) {
            this.setState({isOpen: false});
        }
    }

    /**
     *
     * @param node
     * @returns select element or null if didn't find
     */
    findSelect(node) {
        let el = node;
        while (el) {
            if (el.id === 'select') {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    openOptions(event) {
        this.currentTarget = event.currentTarget;
        this.setState({isOpen: true});
    }

    arrowScroll(index) {
        const list = this.refs.list;
        const listItems = list.children;
        const listTop = listItems[0];
        const target = listItems[index];
        const dis = target.offsetTop - listTop.offsetTop;
        list.scrollTop = dis - (this.refs.list.offsetHeight / 2) + (target.offsetHeight);
    }

    handleSelect(index) {
        if (index === 0) { // disable the select on the first item
            return;
        }
        const {options} = this.props;
        const item = options[index];
        this.setState({selected: index, highlighted: index, isOpen: false});
        console.log(item.name, item.id);
    }

    handleNavigate(event) {
        const {options} = this.props;
        const {highlighted} = this.state;
        const optionsLength = options.length;
        let newIndex = highlighted;

        switch (event.key) {
            case 'ArrowDown':
                newIndex + 1 < optionsLength && newIndex++;
                this.arrowScroll(newIndex);
                break;
            case 'ArrowUp':
                newIndex - 1 >= 0 && newIndex--;
                this.arrowScroll(newIndex);
                break;
            case 'Enter':
                this.handleSelect(newIndex);
                break;
        }
        this.refs[newIndex].focus();
        this.setState({highlighted: newIndex});
    }

    render() {
        const {options} = this.props;
        const {isOpen, selected, highlighted} = this.state;
        return (
            <div className='custom-select'
                 id='select'
                 onClick={this.openOptions}
                 onKeyDown={this.handleNavigate} ref={'select'} tabIndex='0'>
                <div className='selected'>
                    <span className='chosen'>{options[selected].name}</span>
                    <span className='arrow'/>
                </div>
                <div className={`select-box${isOpen ? ' isOpen' : ''}`}>
                    <ul className='select-list' ref='list'>
                        {Object.keys(options).map((object, index) => {
                            const hotel = options[index];
                            return <li onClick={this.handleSelect.bind(this, index)}
                                       ref={index}
                                       className={`select-list__item${highlighted === index ? ' highlighted' : ''}`}
                                       key={hotel.id}>{hotel.name}</li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default UISelect