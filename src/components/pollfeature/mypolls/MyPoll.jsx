import { useEffect, useState, useCallback } from "react";
import PollSelectButton from "./PollSelectButton";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getPollTemplatesByUser } from "../../../services/polls/pollService";

const getPollCreatedAt = (poll) =>
  poll?.createdAt ||
  null;

const getPollUpdatedAt = (poll) =>
  poll?.updatedAt ||
  null;

const getPollOwnerId = (poll) => {
  return poll?.createdBy ||
  null;
};

const getPollArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

const MyPoll = ({
  title = "My Polls",
  dataSource = "browsePolls",
  showRefreshButton = true,
  className = "",
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polls, setPolls] = useState([]);
  const [pollsToDisplay, setPollsToDisplay] = useState([]);

  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser?.uid) {
        setPolls([]);
        setPollsToDisplay([]);
        setError("You need to be signed in to view your polls.");
        return;
      }

      let pollArray = [];

      try {
        const result = await getPollTemplatesByUser(
          currentUser.uid
        );
        pollArray = getPollArray(result);
      } catch (primaryError) {
        console.warn(
          "[MyPoll] getPollTemplatesByUser failed", //trying fallback:",
          primaryError
        );
      }

      const ownerTaggedPolls = pollArray.map((poll) => ({
        ...poll,
        __profileOwnerId: currentUser.uid,
      }));

      setPolls(ownerTaggedPolls);
      setPollsToDisplay(ownerTaggedPolls);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(err.message || "Failed to load polls");
      setPolls([]);
      setPollsToDisplay([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handlePollDeleted = (deletedId) => {
    setPolls((prev) =>
      prev.filter((poll) => {
        return poll.id !== deletedId;
      })
    );

    setPollsToDisplay((prev) =>
      prev.filter((poll) => {
        return poll.id !== deletedId;
      })
    );
  };

  return (
    <div
      className={`min-h-screen bg-primary relative overflow-x-hidden py-20 px-4 sm:px-6 text-[var(--text-primary)] ${className}`}
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gradient-primary text-center drop-shadow-lg">
            {title}
          </h1>

          <div className="flex justify-center">
            <NavLink
              to="/poll"
              aria-label="Make A Poll"
              className="inline-block px-4 py-2 bg-[var(--primary-400)] rounded-lg font-medium text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Make A Poll
            </NavLink>
          </div>
        </div>

        {error && (
          <div className="flex mt-5 justify-center items-center">
            <div className="error-message font-medium">{error}</div>
          </div>
        )}

        <p className="mt-8 text-center text-lg">
          Displaying{" "}
          <span className="font-bold text-[var(--primary-400)]">
            {pollsToDisplay.length}
          </span>{" "}
          polls
        </p>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="text-gradient-primary text-lg">
              Loading polls...
            </div>
          </div>
        ) : pollsToDisplay.length === 0 ? (
          <div className="text-center mt-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-lg">
            <p className="text-lg text-muted">
              You haven't created any polls yet.
            </p>
            <NavLink
              to="/poll"
              className="inline-block mt-4 px-4 py-2 bg-[var(--primary-400)] rounded-lg text-white"
            >
              Create Your First Poll
            </NavLink>
          </div>
        ) : (
          <div
            id="customQuizDiv"
            className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 mt-14 w-full max-w-6xl mx-auto items-start justify-items-center"
          >
            {pollsToDisplay.map((poll, index) => {
              const pollData = poll.data; 
              const creatorId = getPollOwnerId(poll) || currentUser?.uid;

              return (
                <div
                  className="w-full max-w-[390px]"
                  key={`${poll.id || index}-${pollData.question}`}
                >
                  <PollSelectButton
                    title={pollData.question}
                    options={pollData.options}
                    uid={poll.id}
                    creator={pollData.createdBy}
                    createdAt={pollData.createdAt}
                    alwaysShowStartButton={true}
                    showCreatedAtFooter={true}
                    creatorId={creatorId}
                    currentUserId={currentUser?.uid}
                    onDeleted={handlePollDeleted}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            className="inline-block px-4 py-1 bg-[var(--primary-400)] rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-accent disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={fetchPolls}
            disabled={loading}
          >
            {loading ? "Loading..." : showRefreshButton ? "Refresh" : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPoll;