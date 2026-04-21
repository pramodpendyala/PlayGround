public class DynamicDetailFormController {
    
    @AuraEnabled(cacheable=true)
    public static List<Dynamic_Details_Config__mdt> getConfiguration(String objectApiName) {
        return [ SELECT Field_API_Name__c, LWC_Name__c,Object_API_Name__c,Order__c,Row__c,Type__c FROM Dynamic_Details_Config__mdt WHERE Object_API_Name__c = :objectApiName ORDER BY Row__c,Order__c ASC];
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<RowWrapper> getFormConfiguration(String objectApiName) {
        List<Dynamic_Details_Config__mdt> configs = [
            SELECT Field_API_Name__c, Row__c, Order__c 
            FROM Dynamic_Details_Config__mdt 
            WHERE Object_API_Name__c = :objectApiName
            ORDER BY Row__c ASC, Order__c ASC
        ];

        Map<Decimal, List<String>> rowMap = new Map<Decimal, List<String>>();
        for (Dynamic_Details_Config__mdt config : configs) {
            if (!rowMap.containsKey(config.Row__c)) {
                rowMap.put(config.Row__c, new List<String>());
            }
            rowMap.get(config.Row__c).add(config.Field_API_Name__c);
        }

        List<RowWrapper> response = new List<RowWrapper>();
        List<Decimal> sortedRows = new List<Decimal>(rowMap.keySet());
        sortedRows.sort();

        for (Decimal rowNum : sortedRows) {
            response.add(new RowWrapper(rowNum, rowMap.get(rowNum)));
        }
        return response;
    }

    public class RowWrapper {
        @AuraEnabled public Decimal rowNumber;
        @AuraEnabled public List<String> fields;
        public RowWrapper(Decimal rowNum, List<String> flds) {
            this.rowNumber = rowNum;
            this.fields = flds;
        }
    }
}