package com.amazonaws.samples;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazon.ion.IonStruct;
import com.amazon.ion.IonValue;
import software.amazon.qldb.QldbSession;
import software.amazon.qldb.Result;
import software.amazon.qldb.TransactionExecutor;

public  class Createtable {
    public static final Logger log = LoggerFactory.getLogger(Createtable.class);

    private Createtable() { }

    public static void createTable(final TransactionExecutor txn, final String tableName)
    {
        log.info("Creating the '{}' table...", tableName);
        final String createTable = String.format("CREATE TABLE RECORD");
        final Result result = txn.execute(createTable);
        log.info("{} table created successfully.", tableName);
    }
    
    public static void insertrecord(TransactionExecutor txn)
    {
    	
    	 final String query = String.format("INSERT INTO RECORD "
    	 		+ " << {    'NAME' : 'ÀÌ¹ÌÀÚ',  "
    	 		+ "  'ID' : '2014105049',   "
    	 		+ " 'Year' : 2011,  "
    	  		+ "  'Color' : 'Silver' } >> ");
    	 System.out.printf("%s", query);
    	 final Result result = txn.execute(query);
    	
    }
    /*
    public static List<IonStruct> scanTableForDocuments(final TransactionExecutor txn, final String tableName) {
        log.info("Scanning '{}'...", tableName);
        final String scanTable = String.format("SELECT * FROM %s", tableName);
        List<IonStruct> documents = toIonStructs(txn.execute(scanTable));
        log.info("Scan successful!");
        printDocuments(documents);
        return documents;
    }*/
    public static List<IonStruct> toIonStructs(final Result result) {
        final List<IonStruct> documentList = new ArrayList<>();
        result.iterator().forEachRemaining(row -> documentList.add((IonStruct) row));
        return documentList;
    }
    
    public static void printDocuments(final List<IonStruct> documents) {
        documents.forEach(row -> System.out.printf(row.toPrettyString()));
    }
    public static void findVehiclesForOwner(final TransactionExecutor txn) {
        final String query = "SELECT * FROM RECORD";
		
		//log.info("List of Vehicles for owner with GovId: {}...", govId);
		List<IonStruct> documents = toIonStructs(txn.execute(query));
		System.out.println("Execute");
		printDocuments(documents);
	}
    
    public static void main(final String... args)
    {
    	/*
        try (QldbSession qldbSession = ConnectToLedger.createQldbSession()) {
            qldbSession.execute(txn -> {
                createTable(txn, "record");
               }, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
            log.info("Tables created successfully!");
            System.out.println("Table created success");
        } catch (Exception e) {
            log.error("Errors creating tables.", e);
        }
        
    	  try (QldbSession qldbSession = ConnectToLedger.createQldbSession()) {
              qldbSession.execute(txn -> {
                  insertrecord(txn);
                 }, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
              
              System.out.println("insert success");
          } catch (Exception e) {
        	  System.out.println("err");
              log.error("Errors creating tables.", e);
          }
    	*/

  	  try (QldbSession qldbSession = ConnectToLedger.createQldbSession()) {
            qldbSession.execute(txn -> {
            	findVehiclesForOwner(txn);
               }, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
            
            System.out.println("\nsuccess");
        } catch (Exception e) {
      	  System.out.println("err");
            log.error("Errors creating tables.", e);
        }
  	
        
    }
    
}