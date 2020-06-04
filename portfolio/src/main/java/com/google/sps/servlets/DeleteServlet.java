import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

@WebServlet("/delete-comment")
public class DeleteServlet extends HttpServlet {

  /*
  * Removes comment from datastore with the post number passed through post request
  */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    String post = request.getParameter("postNumber"); 
    Query.Filter keyFilter = new Query.FilterPredicate("postNumber", Query.FilterOperator.EQUAL, Integer.parseInt(post));
    Query query = new Query("Comment").setFilter(keyFilter);
    PreparedQuery results = datastore.prepare(query);
    
    // should only return one entity as postNumber is unique
    for (Entity entity : results.asIterable()) {
      datastore.delete(entity.getKey());
    }
    
  }

}