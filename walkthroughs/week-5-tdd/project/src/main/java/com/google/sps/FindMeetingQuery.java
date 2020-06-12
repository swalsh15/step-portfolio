// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Comparator;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    // if meeting only has optional members treat them as mandatory
    Collection<String> mandatoryMembers = new ArrayList();
    Collection<String> optionalMembers = new ArrayList();
    if (request.getAttendees().isEmpty()) {
      mandatoryMembers = request.getOptionalAttendees();
    } else {
      mandatoryMembers = request.getAttendees();
      optionalMembers = request.getOptionalAttendees(); 
    }

    ArrayList<TimeRange> unavailableTimes = new ArrayList();   
    ArrayList<TimeRange> unavailableTimesOptionalMembers = new ArrayList(); 
    // go through all events and find unavailable times
    for (Event e : events) {
      Set<String> attendes = e.getAttendees();
      for (String s : mandatoryMembers) {
        if (attendes.contains(s)) {
          // someone un at time period
          unavailableTimes.add(e.getWhen());
          break;
        }
      }

      for (String s : optionalMembers) {
        if (attendes.contains(s)) {
          // someone optional unavailable at time period
          unavailableTimesOptionalMembers.add(e.getWhen());
          break;
        }
      }
    }

    ArrayList<TimeRange> availableTimes = new ArrayList();
    // stores starting time of available time range
    int start = 0; 
    // end of latest time period looked at 
    int maxEnd = 0;

    Collections.sort(unavailableTimes, TimeRange.ORDER_BY_START);
    for (TimeRange t : unavailableTimes) {
      // checks if meeting nested in other - ignore meeting in this case
      if (t.end() > maxEnd) {
        maxEnd = t.end();
      } else {
        continue;
      }

      // check time period long enough for meeting
      if (t.start() - start < request.getDuration()) {
        start = t.end(); 
        continue; 
      }

      // add avaliable time
      availableTimes.add(TimeRange.fromStartEnd(start, t.start(), false));
      start = t.end();     
    }

    // add from start - end check
    if (TimeRange.END_OF_DAY - start > request.getDuration()) {
      availableTimes.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    } 

    // handle optional members if presenet
    if (optionalMembers.isEmpty()) {
      return availableTimes;
    }

    // add times where mandatory and optional members not busy  
    ArrayList<TimeRange> optionalMemberTimes = new ArrayList();
    for (TimeRange availableTime : availableTimes) {
      for (TimeRange unavailableOptionalTime : unavailableTimesOptionalMembers) {
        if (!availableTime.overlaps(unavailableOptionalTime)) {
          optionalMemberTimes.add(availableTime);
        }
      }
    }

    // if no times work for optional members return all times for mandatory members
    if (optionalMemberTimes.isEmpty()) {
      return availableTimes;
    } else {
      return optionalMemberTimes;
    }
  }
}
