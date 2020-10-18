import React from 'react';
import shopify_api from '../api/shopify_api';

class Card extends React.Component{
    
    state = {
        updateDOM: false
    };

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
    
    disableSelect = (id) => {
        document.querySelector(`#updated_value-select-${ id } .form-control__value-type__select`).disabled = true;
    };

    deleteMetafield = async (e, metafield) => {
        e.preventDefault();

        const response = await shopify_api.delete("/delete_product_metafields", { data: { id: metafield.id } },
            { header: { 'Content-Type': 'application/json' } }
        );

        if(response.status === 200){
            this.props.deleteMetafield(metafield.id);
        };
    };

    updateMetafield = async (e) => {
        e.preventDefault();
        this.setState({
            updateDOM: true
        });
   
        if(this.state.updateDOM){
            if(document.querySelector("#updated_value-select-"+this.props.metafield.id).value === '' || document.querySelector("#updated_value-input-"+this.props.metafield.id).value === ''){
                this.changeColor('red', `Please update your value or select a value type.`);
            }else{
                const response = await shopify_api.put("/update_product_metafields", 
                    { 
                        id: this.props.metafield.id, 
                        value: document.querySelector("#updated_value-input-"+this.props.metafield.id).value, 
                        value_type: document.querySelector("#updated_value-select-"+this.props.metafield.id).value 
                    },
                    { header: { 'Content-Type': 'application/json' } }
                );
                if(response.status === 200){
                    this.props.updateMetafield(response.data.metafield);
                    this.setState({
                        updateDOM: false
                    });
                };
            };
        };
    };

    render(){
        return (
            <div className="card mt-4">
                <div className="card-body">
                    <p className="m-0 font-weight-bold">Metafield { this.props.index }</p>
                    <hr></hr>
                    <p className="small mb-2"><strong>Namespace:</strong> { this.props.metafield.namespace }</p>
                    <p className="small mb-2"><strong>Key:</strong> { this.props.metafield.key }</p>
                    <p className="small mb-0"><strong>Value:</strong> { this.props.metafield.value }</p>
                    <hr></hr>
                    {
                        this.state.updateDOM ?
                        <div className="d-flex update-container">
                            <input id={ "updated_value-input-"+this.props.metafield.id } className="form-control" placeholder="Value"></input>
                            <select id={ "updated_value-select-"+this.props.metafield.id } className="form-control" onChange={ () => this.disableSelect(this.props.metafield.id) } required>
                                <option className="form-control__value-type__select" value="">--Select Value Type--</option>
                                <option value="string">String</option>
                                <option value="integer">Integer</option>
                                <option value="json-string">JSON String</option>
                            </select>
                        </div> : 
                        ''
                    }
                    <div className="d-flex btn-container">
                        <button className="btn btn-success" onClick={ (e) => this.updateMetafield(e) }>Update</button>
                        <button className="btn btn-danger" onClick={ (e) => this.deleteMetafield(e, this.props.metafield) }>Delete</button>
                    </div>
                </div>
            </div>
        );
    };
};

export default Card;