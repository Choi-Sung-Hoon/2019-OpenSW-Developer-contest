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
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.amazon.ion.IonStruct;

import software.amazon.qldb.QldbSession;
import software.amazon.qldb.Result;
import software.amazon.qldb.TransactionExecutor;


public class Broadsocket {

	public static final Logger log = LoggerFactory.getLogger(Createtable.class);


	public static void Handle_msg(String msg) {
		int Inst_case = 0;
		SQLhandling sqlhandle = new SQLhandling();
		try (QldbSession qldbSession = ConnectToLedger.createQldbSession()) {
			JSONParser jsonParse = new JSONParser();
			// JSONParse에 json데이터를 넣어 파싱한 다음 JSONObject로 변환한다.
			
			JSONObject jsonObj = (JSONObject) jsonParse.parse(msg);			
			if(msg.contains("insert"))
			{
				Inst_case = 0;
				
			}
			if(msg.contains("select_host"))
			{
				Inst_case = 1;
				
			}
			if(msg.contains("select_authorizer"))
			{
				Inst_case = 2;
			
			}
			if(msg.contains("select_student"))
			{
				Inst_case = 3;
			}
			if(msg.contains("update_author"))
			{
				Inst_case = 4;
			}
			if(msg.contains("add_list")) // 학생 -> 기업에게 자기 레코드 보는것을 허락
			{
				Inst_case = 5;
			}
			if(msg.contains("select_list")) // 기업이  학생정보 보기 
			{
				Inst_case = 6;
			}
			
			if(Inst_case ==0) // insert
			{
				String result;
				System.out.println("0");
				JSONArray Case_ary = (JSONArray) jsonObj.get("insert");
				qldbSession.execute(txn -> {sqlhandle.insertrecord(txn, Case_ary);
				}, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
			}
			else if(Inst_case ==1)
			{
				String result = null;
				System.out.println("1");
				JSONArray Case_ary = (JSONArray) jsonObj.get("select_host");
				
				qldbSession.execute(txn -> {sqlhandle.select_host(txn, Case_ary);				
				});
			}
			else if(Inst_case ==2)
			{
				JSONArray Case_ary = (JSONArray) jsonObj.get("select_authorizer");
				System.out.println("2");
				qldbSession.execute(txn -> {sqlhandle.select_authorizer(txn, Case_ary);
				}, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
				
			}
			else if(Inst_case ==3)
			{
				System.out.println("3");
				JSONArray Case_ary = (JSONArray) jsonObj.get("select_student");
				qldbSession.execute(txn -> {sqlhandle.select_student(txn, Case_ary);
				}, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
			}
			else if(Inst_case==4)
			{
				System.out.println("4");
				JSONArray Case_ary = (JSONArray) jsonObj.get("update_author");
				qldbSession.execute(txn -> {sqlhandle.update_author(txn, Case_ary);
				}, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
			}
			else if(Inst_case==5)
			{
				System.out.println("5");
				JSONArray Case_ary = (JSONArray) jsonObj.get("add_list");
				qldbSession.execute(txn -> {sqlhandle.update_author(txn, Case_ary);
				}, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
			}
			else if(Inst_case==6)
			{
				System.out.println("6");
				JSONArray Case_ary = (JSONArray) jsonObj.get("select_list");
				qldbSession.execute(txn -> {sqlhandle.update_author(txn, Case_ary);
				}, (retryAttempt) -> log.info("Retrying due to OCC conflict..."));
			}
			
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}



}