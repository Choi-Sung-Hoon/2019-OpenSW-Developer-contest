package com.amazonaws.samples;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.amazon.ion.IonStruct;

import software.amazon.qldb.QldbSession;
import software.amazon.qldb.Result;
import software.amazon.qldb.TransactionExecutor;

public class SQLhandling {
	static ResultValue singleton1 = ResultValue.getInstance();
	
	public static void insertrecord(TransactionExecutor txn, JSONArray memberArray) {
		JSONObject jsonObj = (JSONObject) memberArray.get(0);
		final String query = String.format(
				"INSERT INTO RECORD" + "{ 'student_id' : '%s'," + "'host_id' : '%s'," + "'authorizer_id' : '%s',"
						+ "'student_organization' : '%s'," + "'contest_title' : '%s'," + "'contest_category' : '%s',"
						+ "'date' : '%s'," + "'project_title':'%s'," + "'awarded' : '%s'," + "'prize_name' : '%s' ,"
						+ "'authorization' : 'false'"
						+ " }",
						
				jsonObj.get("student_id"), jsonObj.get("host_id"), jsonObj.get("authorizer_id"),
				jsonObj.get("student_organization"), jsonObj.get("contest_title"), jsonObj.get("contest_category"),
				jsonObj.get("date"), jsonObj.get("project_title"), jsonObj.get("awarded"), jsonObj.get("prize_name"));
		
		
		
		System.out.printf("\n%s", query);
		final Result result = txn.execute(query);
		singleton1.setValue("{\"record\":[{ \"success\" : \"true\" } ]}");

	}
	
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

		// log.info("List of Vehicles for owner with GovId: {}...", govId);
		List<IonStruct> documents = toIonStructs(txn.execute(query));
		System.out.println("Execute");
		printDocuments(documents);
	}
	
	public static void make_str(List<IonStruct> documents )
	{
		
		//제어부분추가
		String result_str="{\"record\":[";
		for(int i=0; i<documents.size();i++)
		{
			result_str=result_str+documents.get(i).toPrettyString();
			if(i!=documents.size()-1)
			{
				result_str=result_str+",";
			}
		}
		result_str=result_str + "]}";
		result_str=result_str.replace("student_id", "\"student_id\"");
		result_str=result_str.replace("host_id", "\"host_id\"");
		result_str=result_str.replace("authorizer_id", "\"authorizer_id\"");
		result_str=result_str.replace("student_organization", "\"student_organization\"");
		result_str=	result_str.replace("contest_title", "\"contest_title\"");
		result_str=	result_str.replace("contest_category", "\"contest_category\"");
		result_str=	result_str.replace("date", "\"date\"");
		result_str=	result_str.replace("project_title", "\"project_title\"");
		result_str=	result_str.replace("awarded", "\"awarded\"");
		result_str=	result_str.replace("prize_name", "\"prize_name\"");
		result_str=	result_str.replace("authorization", "\"authorization\"");

		//System.out.printf("%s", result_str);
		
		singleton1.setValue(result_str);

	}
	
	public static void select_host(TransactionExecutor txn, JSONArray memberArray)
	{
		String result = null;
		JSONObject jsonObj = (JSONObject) memberArray.get(0);
		final String query = "SELECT * FROM RECORD  WHERE host_id='"+(String) jsonObj.get("host_id")+"'";
			
		System.out.printf("%s", query);
		List<IonStruct> documents = toIonStructs(txn.execute(query));
		//documents.forEach(row -> System.out.printf(row.toPrettyString()))
		 make_str(documents);
		//printDocuments(documents);

	}
	public static void select_authorizer(TransactionExecutor txn, JSONArray memberArray)
	{
		
		JSONObject jsonObj = (JSONObject) memberArray.get(0);
		final String query = "SELECT * FROM RECORD  WHERE authorizer_id='"+(String) jsonObj.get("authorizer_id")+"'";
		System.out.printf("%s", query);
		List<IonStruct> documents = toIonStructs(txn.execute(query));
		make_str(documents);
		
	}
	public static void select_student(TransactionExecutor txn, JSONArray memberArray)
	{
		
		JSONObject jsonObj = (JSONObject) memberArray.get(0);
		final String query = "SELECT * FROM RECORD  WHERE student_id='"+(String) jsonObj.get("student_id")+"'";
		System.out.printf("%s", query);
		List<IonStruct> documents = toIonStructs(txn.execute(query));
		//System.out.println(documents.toArray()[0].);
		make_str(documents);
		
	}
	
	public static void update_author(TransactionExecutor txn, JSONArray memberArray)
	{
		
		JSONObject jsonObj = (JSONObject) memberArray.get(0);
		final String query = "UPDATE RECORD AS r SET r.authorization='true' where r.student_id='"+(String) jsonObj.get("student_id")+ "and r.authorizer_id='"+(String) jsonObj.get("authorizer_id")+"' and"
				+ " r.project_title='"+(String) jsonObj.get("project_title")+"'";
		System.out.printf("%s", query);
		final Result result = txn.execute(query);
		ResultValue singleton1 = ResultValue.getInstance();
	}
	
	public static void add_list(TransactionExecutor txn, JSONArray memberArray) // INSERT
	{
		JSONObject jsonObj = (JSONObject) memberArray.get(0);
		final String query = "INSERT INTO student_list {'company_id':'"+jsonObj.get("company_id")+","
				+ " 'student_id':'"+jsonObj.get("student_id")+"'}";
		System.out.printf("%s", query);
		final Result result = txn.execute(query);
		singleton1.setValue("{\"record\":[{ \"success\" : \"true\" } ]}");

	}
	
	public static void select_list(TransactionExecutor txn, JSONArray memberArray) // INSERT
	{
		JSONObject jsonObj = (JSONObject) memberArray.get(0);
		final String query = "SELECT * from RECORD,student_list where RECORD.student_id = student_list.student_id";		
		List<IonStruct> documents = toIonStructs(txn.execute(query));
		make_str(documents);
	}
	
}
	

