public class DynamicDetailFormController {
    @AuraEnabled(cacheable=true)
    public static List<Dynamic_Details_Config__mdt> getConfiguration(String objectApiName) {
        return [ SELECT Field_API_Name__c, LWC_Name__c,Object_API_Name__c,Order__c,Row__c,Type__c FROM Dynamic_Details_Config__mdt WHERE Object_API_Name__c = :objectApiName ORDER BY Row__c,Order__c ASC];
    }
}