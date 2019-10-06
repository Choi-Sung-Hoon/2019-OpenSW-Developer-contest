package com.amazonaws.samples;

public class ResultValue {
	
	  private static ResultValue single_instance = null;
	  String result=null;  
	    private ResultValue() {
	       
	    }
	    
	    public static ResultValue getInstance() {
	        if(single_instance == null) {
	            single_instance = new ResultValue();
	        }
	        
	        return single_instance;
	    }
	    public void setValue(String name)
	    {
	    	result=name;
	    }
	    public String getValue() {
	    	return result;
	    }
	    
}
