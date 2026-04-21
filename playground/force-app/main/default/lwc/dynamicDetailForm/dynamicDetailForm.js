import { LightningElement, api, wire } from 'lwc';
import getFormConfiguration from '@salesforce/apex/DynamicDetailFormController.getFormConfiguration';

export default class DynamicDetailForm extends LightningElement {
    @api recordId;
    @api objectApiName; // Passed automatically if on record page

    formLayout;
    error;

    @wire(getFormConfiguration, { objectApiName: '$objectApiName' })
    wiredConfig({ error, data }) {
        if (data) {
            this.formLayout = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.formLayout = undefined;
            console.error('Error loading dynamic form:', error);
        }
    }
}