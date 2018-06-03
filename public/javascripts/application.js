class TeaManager extends React.Component {
	constructor() {
		super();
		
		this.state = {
			name: "",
			total_price: 0,
			options: [],
			selected: [],
			data: []
		};
	}
	
	// extract the original data
	originalPrice = () => {
		return this.state.data.price;
	}
	
	componentDidMount() {
		
		fetch('https://ricepo-interview-endpoint-td9mf5s8v12x.runkit.sh/:rest_id/menu')
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({
					name: data.name,
					total_price: (data.price/100).toFixed(2),
					options: data.options,
					data: data
				});
			});
  }
  
  addToTotal = (item) => {
  	// concat to the selected array
  	const update_selected = [...this.state.selected, item];
  	this.setState(
  		{selected: update_selected}, 
  		() => this.updatePrice()
		);

  }
  
	calculateTotal = () => {
		return this.state.selected.reduce((accumulator, item) => {
			return accumulator += item.price;
		}, this.originalPrice());
	}
	
	updatePrice = () => {
		const new_total = (this.calculateTotal()/100).toFixed(2);
		this.setState(prevState => {
			return {total_price: new_total};
		});
	}

	// prevent refreshing
	handleClick = (e) => {
		e.preventDefault();
	}
	
  render() {
    return (
      <main>
      	<header className="header">
      		<div className="close-button">X</div>
        	<div className="title">{this.state.name}</div>
        	<a className="price" href="#" onClick={this.handleClick}>
        		{this.state.total_price} ✔
        	</a>
      	</header>
        <OptionManager 
        	options_data={this.state.options}
        	add_to_total={this.addToTotal}
        	updateProduct={this.productUpdate}
        	deleteProduct={this.deleteProduct}
        />
      </main>
    );
  }
}

class OptionManager extends React.Component {
  render () {
		return (
			<OptionList 
				options_data={this.props.options_data}
				add_to_total={this.props.add_to_total}
				updateProduct={this.props.updateProduct}
				deleteProduct={this.props.deleteProduct}
			/>
		);
	}
}

// problems with nested structure: The more child data we have, the deeper our structure will grow
class OptionList extends React.Component {
	render () {
	  const options = this.props.options_data.map((option, index) => {
	  	
	                    return <Option 	key={index}
	                    								title={option.name} 
	                                    chosen={option.chosen} 
	                                    items={option.items}
	                                    max={option.max}
	                                    min={option.min}
	                                    add_to_total={this.props.add_to_total}
	                                    deleteProduct={this.props.deleteProduct}
	                                    updateProduct={this.props.updateProduct}
                            />;
	                   });
	                   
		return (
			<div>
				{options}
			</div>
		);
	}
}

class Option extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      chosen: this.props.chosen,
      max: this.props.max,
      min: this.props.min
    };
  }
  
  handleUpdateSubmit = (product) => {
  	this.props.updateProduct(this.props.id, product);
  }
  
	handleAddTotalClick = (item, e) => {
		e.preventDefault();
		if (this.state.max > 0) {
			this.props.add_to_total(item);
		}
	}
	
	handleDeleteProduct = (e) => {
		e.preventDefault();
		this.props.deleteProduct(this.props.id);
	}
	
	render () {	

		if (this.state.editOn) {

		} else {
			return (
				<div className="product">
					<div className="option-title">
						{this.props.title} 
					</div>	
					<div>								
						<ul>
            {this.props.items.map(function(item, index){
              return <li 
              					className="selection" 
              					onClick={this.handleAddTotalClick.bind(this, item)}
              					key={ index }
              				>
              				<div className="option-items-left">	{item.name} </div>
              				<div className="option-items-right"> 
              					{(item.price/100).toFixed(2)}
              					{item.quantity > 0 &&
              					<span className="quantity-count">{item.quantity}</span>}
              				</div>
              			 </li>;
            }, this)}
            </ul>
						
					</div>
				</div>
			);
		}
	}
}

ReactDOM.render(
  <TeaManager />,
  document.getElementById('app')
);
