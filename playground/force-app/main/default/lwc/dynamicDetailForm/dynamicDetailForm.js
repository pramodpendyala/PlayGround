import { LightningElement, api, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class DynamicDetailForm extends LightningElement {
    @api recordId;
    @api objectApiName; // Passed automatically if on record page

    formLayout;
    error;

// GraphQL Query to fetch metadata
    @wire(graphql, {
        query: gql`
            query getMetadata($objName: String) {
                uiapi {
                    query {
                        Dynamic_Details_Config__mdt(
                            where: { Object_API_Name__c: { eq: $objName } }
                            orderBy: { Row__c: { order: ASC }, Order__c: { order: ASC } }
                        ) {
                            edges {
                                node {
                                    Id
                                    Type__c { value }
                                    Row__c { value }
                                    Order__c { value }
                                    Field_API_Name__c { value }
                                    LWC_Name__c { value }
                                    MasterLabel { value }
                                }
                            }
                        }
                    }
                }
            }
        `,
        variables: '$graphqlVariables'
    })
    wiredGraphQL({ data, errors }) {
        if (data) {
            const records = data.uiapi.query.Dynamic_Details_Config__mdt.edges.map(edge => edge.node);
            console.log("===", JSON.stringify(records));
            this.formLayout = this.transformMetadata(records);
            console.log("====", JSON.stringify(this.formLayout));
        } else if (errors) {
            this.errors = errors;
        }
    }

    get graphqlVariables() {
        return {
            objName: this.objectApiName
        };
    }

    // Transformation logic (Replacement for Apex logic)
    transformMetadata(records) {
        const rowMap = new Map();

        records.forEach(rec => {
            const rowNum = rec.Row__c.value;
            const type = rec.Type__c.value;
            const fieldApi = rec.Field_API_Name__c.value;
            const lwcName = rec.LWC_Name__c.value;
            const label = rec.MasterLabel.value;

            if (!rowMap.has(rowNum)) {
                rowMap.set(rowNum, {
                    rowNumber: rowNum,
                    fields: [],
                    isSection: false,
                    Section: null
                });
            }

            const currentRow = rowMap.get(rowNum);

            if (type === 'Section') {
                currentRow.isSection = true;
                const hasHeaders = (fieldApi && fieldApi.trim() !== '') || (lwcName && lwcName.trim() !== '');

                currentRow.Section = {
                    sectionLabel: label,
                    sectionHeaderLeft: fieldApi,
                    sectionHeaderRight: lwcName,
                    hasHeaders: hasHeaders
                };
            }
            else if (type === 'Field') {
                currentRow.fields.push({
                    apiName: fieldApi,
                    isSpacer: false
                });
            }
            else if (type === 'Space') {
                currentRow.fields.push({
                    apiName: `spacer-${rowNum}-${currentRow.fields.length}`,
                    isSpacer: true
                });
            }
        });

        console.log("==", JSON.stringify(rowMap));
        return Array.from(rowMap.values());
    }

    handleFieldClick(event) {
        // Identify which field was clicked using the data attribute
        const fieldName = event.currentTarget.dataset.field;

        console.log('User clicked on field: ' + fieldName);

        // Specific logic for specific fields
        if (fieldName === 'Name') {
            this.handleAccountNumberClick();
        } else if (fieldName === 'Professional_Profile__c') {
            this.handleWebsiteClick();
        }
    }

    handleAccountNumberClick() {

        console.log('Performing custom validation or logging for Website...');
    }

    handleWebsiteClick() {
        // Example: logic for website field
        console.log('Performing custom validation or logging for Website...');
    }

    handleFieldChange(event) {
        const fieldName = event.currentTarget.dataset.field;
        const newValue = event.detail.value;

        console.log(`Field ${fieldName} changed to: ${newValue}`);

        // Example: Conditional logic based on field change
        switch (fieldName) {
            case 'Name':
                this.handleNameChange(newValue);
                break;
            case 'Professional_Profile__c':
                this.handleProfileChange(newValue);
                break;
            default:
                break;
        }
    }
    handleNameChange(val) {
        console.log("🚀 ~ DynamicDetailForm ~ handleNameChange ~ val:", JSON.stringify(val));
    }
    handleProfileChange(val) {
        console.log("🚀 ~ DynamicDetailForm ~ handleProfileChange ~ val:", JSON.stringify(val));
    }



}