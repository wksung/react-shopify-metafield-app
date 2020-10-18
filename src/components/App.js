import React from 'react';
import shopify_api from '../api/shopify_api';
import MetafieldCard from './MetafieldCard';
import CreateMetafieldForm from '../components/CreateMetafieldForm';
import '../css/style.css';

class App extends React.Component{

    state = {
        products: [],
        selected_product: [],
        metafields: [],
        show_create_btn: false,
        show_create_dom: false
    };

    componentDidMount(){
        this.shopify_api_products();
    }

    changeColor = (color, text) => {
        let notColor = "";
        document.querySelector(".message-log").classList.add(color);
        color === "red" ? notColor = "green" : notColor = "red";
        document.querySelector(".message-log").classList.remove(notColor);
        document.querySelector(".message-log").innerHTML = text;
        setTimeout(() => {
            document.querySelector(".message-log").innerHTML = ``;
        }, 3000);
    };

    shopify_api_products = async () => {
        const response = await shopify_api.get("/get_products");
        this.setState({
            products: response.data.products
        });
    };

    onChangeOption = async (e) => {
        e.preventDefault();
        let id = 0;

        for(let i = 0; i < this.state.products.length; i++){
            if(this.state.products[i].title === e.target.value){
                id = this.state.products[i].id

                this.setState({
                    selected_product: this.state.products[i],
                    show_create_dom: false
                });
            };
        };

        document.querySelector(".message-log").innerHTML = ``;

        const response = await shopify_api.post("/get_product_metafields", { id: id },
            { header: {'Content-Type': 'application/json'} }
        );

        if(response.status === 200){
            document.querySelector(".form-control__select").disabled = true;

            this.setState({
                metafields: response.data.metafields
            }, () => {
                this.setState({
                    show_create_btn: true
                });
            });

            if(response.data.metafields.length === 0){
                this.changeColor("red", `No metafields for this product. Create now.`);
            }
        };
    };

    createMetafield = async (e, data) => {
        e.preventDefault();

        let allowAPI = false;

        if(data.namespace.length >= 3 && data.key.length >= 3 && data.value.length >= 3){
            if(data.value_type === typeof data.value){
                allowAPI = true;
            }else{
                this.changeColor("red", `Value Type must be correct.`);
            }
        }else{
            this.changeColor("red", `Inputs must be 3 characters long.`);
        }

        if(allowAPI){
            const response = await shopify_api.post("/create_product_metafields", 
                { 
                    id: this.state.selected_product.id,
                    params: data
                },
                { header: { "Content-Type": "application/json" } }
            );
            
            if(response.status === 200){
                this.setState({
                    metafields: this.state.metafields.concat(response.data.metafield),
                    show_create_btn: true,
                    show_create_dom: false
                });
                this.changeColor("green", `Metafield has been added to ${ this.state.selected_product.title }.`);
            };
        };
    };

    updateMetafield = (metafield) => {
        let newStateArray = this.state.metafields;

        for (var i in newStateArray) {
            if (newStateArray[i].id === metafield.id) {
                newStateArray[i] = metafield;
                break; 
            };
        };

        this.setState({
            metafields: newStateArray
        });

        this.changeColor("green", `Successfully Updated Metafield`);
    };

    deleteMetafield = (id) => {
        const deletedArray = this.state.metafields.filter((metafield) => {
            return metafield.id !== id;
        });

        this.setState({
            metafields: deletedArray
        });

        this.changeColor("red", `Successfully Deleted Metafield`);
    };
    
    render(){
        let productSelectOption = ``;
        let metafieldsCard = ``;

        if(this.state.products){
            productSelectOption = this.state.products.map(product => {
                return(
                    <option key={ product.id }>{ product.title }</option>
                );
            });
        };
        
        if(this.state.metafields){
            metafieldsCard = this.state.metafields.map( (metafield, i) => {
                return (
                    <MetafieldCard key={ metafield.id } metafield={ metafield } index={ i + 1 } updateMetafield = { this.updateMetafield } deleteMetafield = { this.deleteMetafield }></MetafieldCard>
                );
            });
        };

        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12">
                        <h1 className="h5">Shopify Metafield App</h1>
                    </div>
                    <div className="col-12">
                        <select className="form-control w-100 mt-3 mb-2" onChange={ (e) => this.onChangeOption(e) }>
                            <option className="form-control__select">--Select Product--</option>
                            { productSelectOption }
                        </select>
                        <span className="message-log small"></span>
                        {
                            this.state.show_create_btn ?
                            <button className="btn btn-primary mt-2 w-100" onClick = { () => this.setState({ show_create_dom : true, show_create_btn: false }) }>Create New Metafield</button> :
                            ''
                        }
                        {
                            this.state.show_create_dom ?
                            <CreateMetafieldForm createMetafield = { this.createMetafield }></CreateMetafieldForm> : 
                            ''
                        }
                    </div>
                    <div className="col-12">
                        <div className="d-flex card-container mb-5">
                            { metafieldsCard }
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default App;