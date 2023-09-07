import { useState, useEffect, useRef } from "react";
import SpriteAnimation from "./SpriteAnimation";
import { useMediaQuery } from "react-responsive";
import { notificationAnimations } from "@/app/lib/constants";
import useLoadingStore from "@/app/hooks/useLoadingStore";
import { CSSTransition } from "react-transition-group";

export interface NotificationComponentProps {
  notifications: any[];
}

const NotificationComponent = ({
  notifications,
}: NotificationComponentProps) => {
  const notificationIndex = useLoadingStore((state) => state.notificationIndex);
  const setNotificationIndex = useLoadingStore(
    (state) => state.setNotificationIndex
  );
  const resetNotification = useLoadingStore((state) => state.resetNotification);
  const showNotification = useLoadingStore((state) => state.showNotification);

  const prevIndex = useRef<number>();
  useEffect(() => {
    prevIndex.current = notificationIndex;
  }, [notificationIndex]);

  useEffect(() => {
    if (notificationIndex < notifications.length - 1) {
      const timer = setTimeout(() => {
        setNotificationIndex(prevIndex.current ?? 0);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    } else if (notificationIndex === notifications.length - 1) {
      const timer = setTimeout(() => {
        resetNotification();
        setNotificationIndex(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, notificationIndex]);

  return (
    <CSSTransition
      in={showNotification}
      timeout={300}
      classNames="notification"
      unmountOnExit
      key={notificationIndex}
    >
      <div className="fixed top-1/16 left-auto w-[90%] sm:left-3/8 sm:w-1/4 border-4 border-terminal-green bg-terminal-black z-50 shadow-xl">
        <div className="flex flex-row w-full gap-5 sm:p-2">
          <div className="sm:hidden w-1/6 sm:w-1/4">
            <SpriteAnimation
              frameWidth={80}
              frameHeight={80}
              columns={7}
              rows={16}
              frameRate={5}
              animations={notificationAnimations}
              currentAnimation={notifications[notificationIndex]?.animation}
            />
          </div>
          <div className="w-1/6 sm:w-1/4 hidden sm:block">
            <SpriteAnimation
              frameWidth={100}
              frameHeight={100}
              columns={7}
              rows={16}
              frameRate={5}
              animations={notificationAnimations}
              currentAnimation={notifications[notificationIndex]?.animation}
            />
          </div>
          <div className="w-5/6 sm:w-3/4 m-auto text-sm sm:text-lg">
            {notifications[notificationIndex]?.message}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default NotificationComponent;
