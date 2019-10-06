package com.amazonaws.samples;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.qldbsession.AmazonQLDBSessionClientBuilder;

import software.amazon.qldb.PooledQldbDriver;
import software.amazon.qldb.QldbDriver;
import software.amazon.qldb.QldbSession;
import software.amazon.qldb.exceptions.QldbClientException;


	
	public final class ConnectToLedger {
	    public static final Logger log = LoggerFactory.getLogger(ConnectToLedger.class);
	    public static AWSCredentialsProvider credentialsProvider;
	    public static String endpoint = null;
	    public static String ledgerName = "Award";
	    public static String region = null;

	    public static PooledQldbDriver driver = createQldbDriver();

	    private ConnectToLedger() { }

	    /**
	     * Create a pooled driver for creating sessions.
	     *
	     * @return The pooled driver for creating sessions.
	     */
	    public static PooledQldbDriver createQldbDriver() {
	        AmazonQLDBSessionClientBuilder builder = AmazonQLDBSessionClientBuilder.standard();
	        builder.withRegion(Regions.US_EAST_1);
	        if (null != endpoint && null != region) {
	            builder.setEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endpoint, region));
	        }
	        if (null != credentialsProvider) {
	            builder.setCredentials(credentialsProvider);
	        }
	        return PooledQldbDriver.builder()
	                .withLedger("Award")
	                .withRetryLimit(Constants.RETRY_LIMIT)
	                .withSessionClientBuilder(builder)
	                .build();
	    }

	    /**
	     * Connect to a ledger through a {@link QldbDriver}.
	     *
	     * @return {@link QldbSession}.
	     */
	    public static QldbSession createQldbSession() {
	        return driver.getSession();
	    }

	    public static void main(String[] args)
	    {
	        try (QldbSession qldbSession = createQldbSession()) {
	            log.info("Listing table names ");
	            System.out.printf("In main");
	            for (String tableName : qldbSession.getTableNames()) {
	                log.info(tableName);
	                System.out.printf("%s\n",tableName);
	            }
	        } catch (QldbClientException e) {
	            log.error("Unable to create session.", e);
	        }
	    }
}
	
	

