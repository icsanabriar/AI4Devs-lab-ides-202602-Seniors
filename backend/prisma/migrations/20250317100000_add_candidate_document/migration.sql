-- CreateTable
CREATE TABLE "CandidateDocument" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateDocument" ADD CONSTRAINT "CandidateDocument_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
