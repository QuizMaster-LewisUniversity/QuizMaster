import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DeletePollButton from "./DeletePollButton";
import { formatCreatedTimestamp } from "../../../utils/dateFormatter";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../services/firebase/firebaseService";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";

const getCreatedAtFromPollData = (data) =>
  data?.timestamps?.createdAt ||
  data?.metadata?.createdAt ||
  data?.createdAt ||
  data?.timeCreated ||
  data?.createdOn ||
  null;


const PollSelectButton = ({
  title,
  options,
  uid,
  creator,
  creatorUsername,
  creatorId,
  currentUserId,
  linkCreatorToProfile = false,
  onDeleted,
  createdAt,
  alwaysShowStartButton = true,
  showCreatedAtFooter = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [resolvedCreatorUsername, setResolvedCreatorUsername] = useState(null);
  const [fetchedCreatedAt, setFetchedCreatedAt] = useState(null);

  const isCreator = currentUserId && creatorId && currentUserId === creatorId;
  const showOwnerEditAction = isCreator && location.pathname === "/myquizzes";
  const formattedCreatedAt = formatCreatedTimestamp(createdAt || fetchedCreatedAt);
  const shouldShowCreatedAtFooter = showCreatedAtFooter && formattedCreatedAt;
  const shouldShowPublicStartButton = alwaysShowStartButton 

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const provided =
          typeof creatorUsername === "string" ? creatorUsername.trim() : "";

        if (provided) {
          if (!cancelled) setResolvedCreatorUsername(null);
          return;
        }

        const uidToLookup = creatorId;

        if (!uidToLookup) {
          if (!cancelled) setResolvedCreatorUsername(null);
          return;
        }

        const q = query(
          collection(db, "usernames"),
          where("uid", "==", uidToLookup),
          limit(1)
        );

        const snap = await getDocs(q);

        if (cancelled) return;

        if (snap.empty) {
          setResolvedCreatorUsername(null);
          return;
        }

        const docSnap = snap.docs[0];
        const data = docSnap.data() || {};
        const uname = (data.username || docSnap.id || "").toString().trim();

        setResolvedCreatorUsername(uname ? uname : null);
      } catch (e) {
        if (!cancelled) setResolvedCreatorUsername(null);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [creatorUsername, creatorId]);

  function getCreatorLabel() {
    const effective =
      (typeof resolvedCreatorUsername === "string" && resolvedCreatorUsername.trim()
        ? resolvedCreatorUsername.trim()
        : "") ||
      (typeof creatorUsername === "string" && creatorUsername.trim()
        ? creatorUsername.trim()
        : "");

    if (effective) {
      return `@${effective.replace(/^@/, "")}`;
    }

    if (creator && typeof creator === "object") {
      const handle = typeof creator.handle === "string" ? creator.handle.trim() : "";

      if (handle) return handle.startsWith("@") ? handle : `@${handle}`;

      const uname =
        typeof creator.username === "string" ? creator.username.trim() : "";

      if (uname) return `@${uname.replace(/^@/, "")}`;
    }

    if (typeof creator === "string" && creator.trim()) {
      return creator.trim();
    }

    return "Anonymous";
  }

  function getCreatorProfilePath() {
    const creatorLabel = getCreatorLabel();
    const username =
      typeof creatorLabel === "string" ? creatorLabel.trim().replace(/^@/, "") : "";

    if (username) {
      return `/u/${username}`;
    }

    if (creatorId) {
      return `/user/${creatorId}`;
    }

    return null;
  }

  function renderCreatorName() {
    const creatorLabel = getCreatorLabel();
    const creatorProfilePath = getCreatorProfilePath();

    if (linkCreatorToProfile && creatorProfilePath) {
      return (
        <>
          Created by:{" "}
          <Link
            to={creatorProfilePath}
            className="text-[var(--primary-400)] hover:underline"
          >
            {creatorLabel}
          </Link>
        </>
      );
    }

    return <>Created by: {creatorLabel}</>;
  }


  const handleCreatorStart = () => {
    navigate(`/poll?load=${uid}`, {
      state: { from: location.pathname },
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl min-w-0 text-center">
        <div className="card min-h-[450px] relative w-full min-w-0 rounded-2xl shadow-lg hover:shadow-xl border border-[var(--border)] h-full flex flex-col transition-all duration-200">
            <>
              <div className="p-6 flex-grow flex flex-col text-center">
                <div
                  className="min-h-[72px] line-clamp-2 overflow-hidden text-2xl text-[var(--accent)] font-bold mb-3 leading-tight text-center cursor-pointer"
                  onClick={handleCreatorStart}
                >
                  {title}
                </div>

                <div className="text-sm text-[var(--text-secondary)] mb-3">
                  {renderCreatorName()}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-base text-[var(--text-secondary)]">
                    Options: {options.map((opt,i) => `${opt}` + 
					(i+1 < options.length? ", " : ""))
					}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Start ${title || "poll"}`}
                  className="w-full px-4 py-2 bg-[var(--btn-primary-bg)] hover:bg-[var(--accent-hover)] text-[var(--btn-primary-text)] rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={handleCreatorStart}
                >
                  Go To Poll
                </button>


              </div>
            </>

          <div className="min-h-[16px] p-4 border-t border-[var(--border)]">
            {shouldShowCreatedAtFooter ? (
              <p className="mb-3 text-center text-xs font-medium text-[var(--text-secondary)] opacity-70">
                Created {formattedCreatedAt}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <DeletePollButton
                pollId={uid}
                creatorId={creatorId}
                currentUserId={currentUserId}
                onDeleted={onDeleted}
              />

              {showOwnerEditAction ? (
                <Link
                  to={`/customquiz/${uid}`}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--primary-500)] bg-[var(--primary-400)] px-3 text-xs font-semibold text-[var(--neutral-900)] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Edit
                </Link>
              ) : null}
            </div>
          </div>
        </div>
    </div>
  );
};

export default PollSelectButton;
