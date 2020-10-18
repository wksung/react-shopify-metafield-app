import React from 'react';

class CreateMetafieldForm extends React.Component{

    state = {
        namespace: '',
        key: '',
        value: '',
        value_type: ''
    };

    changenkv = (e, type) => {
        if(type === "namespace"){
            this.setState({ namespace: e.target.value });
        }else if(type === "key"){
            this.setState({ key: e.target.value });
        }else if(type === "value"){
            this.setState({ value: e.target.value });
        }
    }

    changeValueType = (e) => {
        document.querySelector(".form-control__value-type__select").disabled = true;

        this.setState({ value_type: e.target.value });
    };

    render(){
        return (
            <form className="card w-100 mt-3 create-metafields" onSubmit = { (e) => this.props.createMetafield(e, this.state) }>
                <div className="card-body">
                    <div className="create-metafields__input">
                        <label className="small mt-3">Namespace:</label>
                        <input onChange = { (e) => this.changenkv(e, "namespace") } type="text" className="form-control namespace" placeholder="Namespace" required></input>
                    </div>
                    <div className="create-metafields__input">
                        <label className="small mt-3">Key:</label>
                        <input onChange = { (e) => this.changenkv(e, "key") } type="text" className="form-control key" placeholder="Key" required></input>
                    </div>
                    <div className="create-metafields__input">
                        <label className="small mt-3">Value:</label>
                        <input onChange = { (e) => this.changenkv(e, "value") } type="text" className="form-control value" placeholder="Value" required></input>
                    </div>
                    <div className="create-metafields__input">
                        <label className="small mt-3">Value Type:</label>
                        <select className="form-control" onChange = { (e) => this.changeValueType(e) } required>
                            <option className="form-control__value-type__select" value="">--Select Value Type--</option>
                            <option value="string">String</option>
                            <option value="integer">Integer</option>
                            <option value="json-string">JSON String</option>
                        </select>
                    </div>
                    <button className="btn btn-primary w-100 mt-3">Create Metafield</button>
                </div>
            </form>
        );
    }
}
export default CreateMetafieldForm;