package com.amazonaws.samples;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.lang.reflect.Field;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Server
{

	
   private static final int PORT = 2555;
   private static final int THREAD_CNT = 5;
   private static ExecutorService threadPool = Executors.newFixedThreadPool(THREAD_CNT);
   private static ServerSocket serverSocket;
   
   public static void main(String[] args)
   {
	   
  
      try
      {
         serverSocket = new ServerSocket(PORT);

         // 소켓서버가 종료될때까지 무한루프
         while(true)
         {
            // 소켓 접속 요청이 올때까지 대기합니다.
            Socket socket = serverSocket.accept();
            try
            {
               // 요청이 오면 스레드 풀의 스레드로 소켓을 넣어줍니다.
               // 이후는 스레드 내에서 처리합니다.
               threadPool.execute(new ConnectionWrap(socket));
            }
            catch(Exception e)
            {
               e.printStackTrace();
            }
         }
      }
      catch (IOException e)
      {
         e.printStackTrace();
      }
   }
}

// 소켓 처리용 래퍼 클래스입니다.
class ConnectionWrap implements Runnable
{
   private Socket socket = null;
   public ConnectionWrap(Socket socket)
   {
      this.socket = socket;
   }

   @Override
   public void run()
   {
	   InputStream inputStream;
	   OutputStream outputStream;
      JSONObject json, payload;
      JSONArray jsonArray;
      while(true)
      {
         try
         {
        	  inputStream = socket.getInputStream();
              outputStream = socket.getOutputStream();
              
              byte[] bytes = new byte[1024];
              int length = inputStream.read(bytes);
              String message = new String(bytes, 0, length);
              System.out.println(message);
              
              Broadsocket bs = new Broadsocket();
              bs.Handle_msg(message);
              ResultValue singleton1 = ResultValue.getInstance();
              System.out.printf("%s", singleton1.getValue());
              
              String reply = singleton1.getValue();
              bytes = reply.getBytes();
              outputStream.write(bytes);
            
            
            
            
         }
         catch (IOException e)
         {
            // TODO Auto-generated catch block
            e.printStackTrace();
         }
      }
   }
}