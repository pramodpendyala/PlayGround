import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getConfiguration from '@salesforce/apex/DynamicDetailFormController.getConfiguration';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DynamicDetailForm extends LightningElement {
    @api recordId;
    @api objectApiName; // Passed from App Builder or Parent
    @track fields;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;

    get objectLabel() {
        return this.objectInfo.data ? this.objectInfo.data.label : '';
    }
    get title(){
        return this.objectLabel+' Details.'
    }
    @wire(getConfiguration, { objectApiName: '$objectApiName' })
    wiredFields({ error, data }) {
        if (data) {
            console.log('Fields received==', JSON.stringify(data));
            this.fields = data;
        } else if (error) {
            console.error('Error fetching metadata==', error);
        }
    }

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record updated successfully!',
                variant: 'success',
            })
        );
    }
}