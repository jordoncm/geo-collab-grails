package ocm

import java.util.UUID

/**
 * Simple domain class to track active editors on maps.
 */
class ActiveEditor {
  // Using a string for the mapId instead a foreign key relation since we only
  // need to use the id as way to aggregate the common editors.
  String mapId
  long lastCheckIn = System.currentTimeMillis()

  static constraints = {
  }
}
