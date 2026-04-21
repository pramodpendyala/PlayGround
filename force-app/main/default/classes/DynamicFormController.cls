public with sharing class DynamicFormController {
    @AuraEnabled(cacheable=true)
    public static List<String> getConfiguration(String objectApiName) {
        List<String> fieldNames = new List<String>();
        
        // Query metadata ordered by the 'Order' field
        for (Dynamic_Field_Config__mdt config : [SELECT Field_API_Name__c FROM Dynamic_Field_Config__mdt WHERE Object_API_Name__c = :objectApiName ORDER BY Order__c ASC ]) {
            fieldNames.add(config.Field_API_Name__c); 
        }
        return fieldNames;
    }
}