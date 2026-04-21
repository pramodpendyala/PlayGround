import { LightningElement, api, wire, track } from 'lwc';
import getConfiguration from '@salesforce/apex/DynamicFormController.getConfiguration';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GenericRecordDetails extends LightningElement {
    @api recordId;
    @api objectApiName; // Passed from App Builder or Parent
    @track fields;

    @wire(getConfiguration, { objectApiName: '$objectApiName' })
    wiredFields({ error, data }) {
        if (data) {
            this.fields = data;
        } else if (error) {
            console.error('Error fetching metadata:', error);
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