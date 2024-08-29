import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../modules/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";

export default class ActivityStore {
  activityRegistery = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistery.values()).sort((a, b) => {
      return a.date!.getTime() - b.date!.getTime();
    });
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce(
        (activities, activity) => {
          const date = format(activity.date!, "dd MMM yyyy");
          activities[date] = activities[date]
            ? [...activities[date], activity]
            : [activity];
          return activities;
        },
        {} as { [key: string]: Activity[] }
      )
    );
  }

  loadingActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.activityRegistery.get(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.selectedActivity = activity;
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity = (activity: Activity | undefined) => {
    if (activity === undefined) return;
    activity.date = new Date(activity.date!);
    this.activityRegistery.set(activity.id, activity);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();

    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistery.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
      /* empty */
    } catch (error) {
      console.log();
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;

    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistery.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;

    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistery.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
